const { jsonResponse } = require("../lib/jsonResponse");
const router = require("express").Router();
const pool = require("../bd/conexionBD")
const bcrypt = require("bcrypt")

router.post("/", async (req, res) => {
    const { nombre, usuario, correo, clave, rol } = req.body
    const password = clave;

    //*Vemos si los campos no esta vacios
    if (!!!nombre || !!!usuario || !!!correo || !!!password) {
        return res.status(400).json(jsonResponse(400, {
            error: "Los campos no pueden estar vacios"
        }))
    }

    //*Creamos el usuario
    let conexion = await pool.getConnection();
    try {

        //*Verificar si el usuario ya existe
        const [usuarioExistente] = await pool.query(
            'SELECT id FROM usuarios WHERE usuario = ? ',
            [usuario]
        );

        const [correoExistente] = await pool.query(
            'SELECT id FROM usuarios WHERE correo = ?',
            [correo]
        );

        if (usuarioExistente.length > 0) {
            return res.status(409).json({
                error: 'El usuario ya se encuentra registrado'
            });
        } else if (correoExistente.length > 0) {

            return res.status(409).json({
                error: 'El email ya se encuentra registrado'
            });
        }

        //*Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // //*Crear usuario en la base de datos
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, usuario, correo, contraseña, rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, usuario, correo, hashedPassword, rol]
        );
        console.log(result)

        res.status(200).json(jsonResponse(200, { mensaje: "Usuario creado con exito" }))

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        })
    }
})

module.exports = router;