const { verificarAccessToken } = require("./verificarToken");
const getTokenFrontHeader = require("./getTokenFrontHeader");
const { jsonResponse } = require("../lib/jsonResponse");

function autenticar(req, res, next) {
    const token = getTokenFrontHeader(req.headers);

    if (token) {
        const decoded = verificarAccessToken(token);
        if (decoded) {
            req.user = { ...decoded.user }; // Guardamos la información del usuario en el objeto de solicitud
            next(); // Llamamos al siguiente middleware o ruta
        } else {
            return res.status(401).send(jsonResponse(401, { error: "Token invalido" }));
        }
    } else {
        return res.status(401).send(jsonResponse(401, { error: "No autorizado" }));
    }
}

module.exports = autenticar;