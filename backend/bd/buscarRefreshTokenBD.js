const pool = require("./conexionBD")
const { decodificarToken } = require("../lib/decodificarToken");

async function BuscarRefreshTokenBD(refreshToken) {

    if (!refreshToken) {
        throw new Error("Token no proporcionado");
    }
    const decodedToken = decodificarToken(refreshToken);

    try {

        const [tokens] = await pool.query(
            `SELECT id, user_id, token_hash, expires_at, revoked 
                FROM refresh_tokens 
                WHERE user_id = ? AND revoked = 0`,
            [decodedToken.userId]
        );

        if (tokens.length === 0) {
            console.log("No se encontra un token")
            return null;
        }

        return tokens[0].token_hash;
    } catch (error) {

        console.error('Error en buscar el token en la base de datos:', error);

    } finally {

        pool.releaseConnection();
    }

}


module.exports = { BuscarRefreshTokenBD };