const jwt = require('jsonwebtoken');
require("dotenv").config();

function verificarRefreshToken(token) {
    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return payload;
        //Payload: { userId: 1, iat: 1749585290, exp: 1750190090 }
    } catch (error) {
        return null;
    }
}

function verificarAccessToken(token) {
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}

module.exports = { verificarAccessToken, verificarRefreshToken };


verificarRefreshToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0OTU4NTI5MCwiZXhwIjoxNzUwMTkwMDkwfQ.CjQIlEN-FIaHuTuZFsu0WNK3Wz5QT17GsrWUQp0gKkY")