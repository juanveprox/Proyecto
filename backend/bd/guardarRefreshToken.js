const mysql = require('mysql2/promise');
const bcrypt = require("bcrypt")
const pool = require("../bd/conexionBD")

async function guardarRefreshToken(userId, refreshToken) {

    //*Hash del token
    const saltRounds = 10;
    const hashedToeken = await bcrypt.hash(refreshToken, saltRounds);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);//*7 Días de expiración

    try {

        //* Primero revoca cualquier token activo previo
        await pool.query(
            `UPDATE refresh_tokens SET revoked = TRUE 
            WHERE user_id = ? AND revoked = FALSE`,
            [userId]
        );

        //*Insertamos datos
        await pool.query(
            `INSERT INTO refresh_tokens 
            (user_id, token_hash, expires_at) 
            VALUES (?, ?, ?)`,
            [userId, hashedToeken, expiresAt]
        )
    } catch (error) {
        console.error('Error almacenando refresh token:', error);
    } finally {
        pool.releaseConnection();
    }

}


module.exports = { guardarRefreshToken }