const getTokenFrontHeader = require("../auth/getTokenFrontHeader");
const { buscarUsuarioBD } = require("../bd/buscarUsuarioBD");
const { jsonResponse } = require("../lib/jsonResponse");
const jwt = require('jsonwebtoken');
const router = require("express").Router();

router.get("/", async (req, res) => {

    const accessToken = getTokenFrontHeader(req.headers)

    if (!accessToken) {
        return res.status(401).send(jsonResponse(401, { error: "No autorizado" }));
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            // Diferenciar entre token expirado e inválido
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json(jsonResponse(401, {
                    error: 'Token expirado',
                    expired: true
                }));
            }
            return res.sendStatus(403);
        }

        try {

            const usuario = await buscarUsuarioBD(user.userId)
            if (!usuario) {
                return res.status(404).send(jsonResponse(404, { error: "Usuario no encontrado" }));
            }


            res.status(200).json(jsonResponse(200, usuario));
        } catch (error) {
            console.error('Error buscando usuario:', error);
            res.sendStatus(500);
        }


    })

    // res.status("200").json(jsonResponse(200, req.user));
})

module.exports = router;