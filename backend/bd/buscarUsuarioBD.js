
const pool = require("../bd/conexionBD")
async function buscarUsuarioBD(idUsuario) {

    try {
        if (!idUsuario) {
            throw new Error("ID de usuario no proporcionado");
        }

        const [users] = await pool.query(
            'SELECT id, nombre ,usuario, correo, rol  FROM usuarios WHERE id = ?',
            [idUsuario]
        );

        if (users.length === 0) {
            return null;
        }


        return users[0];

    } catch (error) {
        console.error("Error al buscar usuario en la bd:", error);
        return null;
    } finally {
        pool.releaseConnection();
    }

}

module.exports = { buscarUsuarioBD };

