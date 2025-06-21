const { decodificarToken } = require("../lib/decodificarToken");
const pool = require("./conexionBD");

async function invalidarRefreshTokenBD(token) {
    try {
        const infoToken = decodificarToken(token);

        const [resultado] = await pool.query(
            'UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?',
            [infoToken.userId]
        );


        if (resultado.affectedRows === 0) {
            console.log("No se encontro un token para invalidar");
            return { message: 'Token no encontrado o ya invalidado' };
        }

        console.log(`Refresh token invalidado para el usuario ${infoToken.userId}`);
        return true;

    } catch (error) {

        console.error('Error al invalidar el token', error);
        throw new Error('Token no se puedo invalidar');

    } finally {
        pool.releaseConnection();
    }
}

module.exports = {
    invalidarRefreshTokenBD
};