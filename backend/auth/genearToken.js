const jwt = require("jsonwebtoken")
require("dotenv").config();

function generateAccessToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.coreo,
            //role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
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

