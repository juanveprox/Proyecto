const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const pool = require("../bd/conexionBD")
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../auth/genearToken");
const { infoUsuario } = require("../lib/infoUsuario");
const { guardarRefreshToken } = require("../bd/guardarRefreshToken");



router.post("/", async (req, res) => {
    const { usuario, password } = req.body

    try {
        //*Verificar que datos no esten vacios
        if (!!!usuario || !!!password) {
            return res.status(400).json(jsonResponse(400, {
                error: "Los campos no pueden estar vacios"
            }))
        }

        //*Buscar usuario en la base de datos
        const [users] = await pool.query(
            'SELECT id,nombre ,usuario, contraseña, correo, rol FROM usuarios WHERE usuario = ?',
            [usuario]
        );

        if (users.length === 0) {
            return res.status(400).json(jsonResponse(400, { error: 'Usuario No existe' }));
        }
        const user = users[0]

        //*Verificamos contraseña
        const passwordValid = await bcrypt.compare(password, user.contraseña);

        if (!passwordValid) {
            return res.status(400).json(jsonResponse(400, { error: 'Contraseña incorrecta' }));
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // console.log(refreshToken)
        guardarRefreshToken(user.id, refreshToken)

        const datosUsuario = infoUsuario(user)
        console.log(datosUsuario)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Asegúrate de que esto sea true en producción
            sameSite: "strict", // Cambia a 'Lax' si necesitas compatibilidad con navegadores más antiguos
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
        }).json(jsonResponse(200, { accessToken, datosUsuario }));

    } catch (error) {
        console.log("ERROR: ", error)
    } finally {
        pool.releaseConnection();
    }


})
module.exports = router;


