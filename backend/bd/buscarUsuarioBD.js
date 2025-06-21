
const pool = require("../bd/conexionBD")
async function buscarUsuarioBD(idUsuario) {

    try {
        if (!idUsuario) {
            throw new Error("ID de usuario no proporcionado");
        }

        const [users] = await pool.query(
            'SELECT id, nombre ,usuario, correo FROM usuarios WHERE id = ?',
            [idUsuario]
        );

        if (users.length === 0) {
            return null;
        }

        console.log("Usuario encontrado:", users[0]);
        return users[0];

    } catch (error) {
        console.error("Error al buscar usuario en la bd:", error);
        return null;
    } finally {
        pool.releaseConnection();
    }

}

module.exports = { buscarUsuarioBD };

buscarUsuarioBD(2)