function infoUsuario(objeto) {
    const propiedades = ["id", "nombre", "usuario"]
    let resultado = {};
    propiedades.forEach(prop => {
        if (prop in objeto) {
            resultado[prop] = objeto[prop];
        }
    });

    return resultado
}


module.exports = { infoUsuario }