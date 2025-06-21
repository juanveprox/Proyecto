const getTokenFrontHeader = require("../auth/getTokenFrontHeader");
const { jsonResponse } = require("../lib/jsonResponse");
const { BuscarRefreshTokenBD } = require("../bd/buscarRefreshTokenBD");
const { verificarRefreshToken } = require("../auth/verificarToken");
const { compararTokens } = require("../auth/compararTokens");
const { generateAccessToken } = require("../auth/genearToken");
const { buscarUsuarioBD } = require("../bd/buscarUsuarioBD");

const router = require("express").Router();

router.post("/", async (req, res) => {

    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
        return res.status(401).send(
            jsonResponse(401,
                { error: "No se encontro el refreshToken" }));
    }

    try {

        const tokenBD = await BuscarRefreshTokenBD(refreshToken);
        if (!tokenBD) {
            return res.status(401).send(
                jsonResponse(401,
                    { error: "Token no encontrado" }));
        }

        const tokenComparado = compararTokens(tokenBD, refreshToken);
        if (!tokenComparado) {
            return res.status(401).send(
                jsonResponse(401,
                    { error: "Token no coincide" }));
        }

        const payload = verificarRefreshToken(refreshToken);
        if (!payload) {
            return res.status(401).send(jsonResponse(401, { error: "Token invalido" }));
        } else {

            idUsuario = payload.userId;
            usuario = buscarUsuarioBD(idUsuario);
            const accessToken = generateAccessToken(usuario)

            res.status(200).send(
                jsonResponse(200,
                    { accessToken }));
        }


    } catch (error) {
        console.error("Error al procesar el refresh token:", error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json(jsonResponse(403, {
                success: false,
                error: 'Token inválido'
            }));
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json(jsonResponse(403, {
                success: false,
                error: 'Refreshtoken expirado'
            }));
        }

        res.status(500).json(jsonResponse(500, {
            success: false,
            error: 'Error interno del servidor'
        }));


    }

})

module.exports = router;