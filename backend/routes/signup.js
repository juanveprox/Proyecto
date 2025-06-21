const { jsonResponse } = require("../lib/jsonResponse");
const router = require("express").Router();
const pool = require("../bd/conexionBD")
const bcrypt = require("bcrypt")

router.post("/", async (req, res) => {
    const { nombre, usuario, correo, password } = req.body

    console.log(req.body)
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
                error: 'El usuario ya esta registrado'
            });
        } else if (correoExistente.length > 0) {

            return res.status(409).json({
                error: 'El email ya esta registrado'
            });
        }

        //*Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //*Crear usuario en la base de datos
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, usuario, correo, contraseña) VALUES (?, ?, ?, ?)',
            [nombre, usuario, correo, hashedPassword]
        );
        console.log(result)

        res.status(200).json(jsonResponse(200, { mensaje: "Usuario creado con exito" }))
        res.send("Signup")

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        })
    }
})

module.exports = router;