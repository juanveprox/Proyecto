const jwt = require("jsonwebtoken")
require("dotenv").config();

function generateAccessToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.coreo,
            rol: user.rol
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
}
module.exports = { generateAccessToken, generateRefreshToken }

