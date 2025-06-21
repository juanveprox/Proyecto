const bcrypt = require("bcrypt");

async function compararTokens(tokenBD, tokenFront) {
    try {
        // Compara el token almacenado en la base de datos con el token recibido del frontend
        const isMatch = await bcrypt.compare(tokenFront, tokenBD);
        return isMatch;
    } catch (error) {
        console.error("Error al comparar tokens:", error);
        throw new Error("Error al comparar tokens");
    }
}

module.exports = { compararTokens };