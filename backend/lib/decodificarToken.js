const jwt = require('jsonwebtoken');
function decodificarToken(refreshToken) {
    let decodedToken;
    try {
        decodedToken = jwt.decode(refreshToken);
        if (!decodedToken?.userId) {
            return { valid: false, userId: null, message: 'Token JWT inválido' };
        }
    } catch (error) {
        return { valid: false, userId: null, message: 'Error decodificando token' };
    }
    return decodedToken;
}



module.exports = { decodificarToken };
