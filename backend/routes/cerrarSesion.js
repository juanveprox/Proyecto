const { invalidarRefreshTokenBD } = require("../bd/invalidarRefreshTokenBD");
const { jsonResponse } = require("../lib/jsonResponse");

const router = require("express").Router();

router.post("/", (req, res) => {
    function limpiarRefreshTokenCookies(res) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: '/'
        });
    }


    try {

        const refreshToken = req.cookies.refreshToken;


        if (!refreshToken) {
            return res.status(400).json(jsonResponse(400, { message: 'No se encontró refresh token' }));
        }

        const tokenInvalido = invalidarRefreshTokenBD(refreshToken)

        if (!tokenInvalido) {
            return res.status(400).json(jsonResponse(400, { message: 'No se pudo invalidar el token' }));
        }

        limpiarRefreshTokenCookies(res)

        res.status(200).json(jsonResponse(200, { message: 'Sesión cerrada correctamente' }));

    } catch (error) {
        return res.status(500).json(jsonResponse(500, { message: 'Error al cerrar sesión' }));
    }




})

module.exports = router;