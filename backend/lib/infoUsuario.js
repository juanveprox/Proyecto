function infoUsuario(objeto) {
    const propiedades = ["id", "nombre", "usuario", "correo", "rol"]
    let resultado = {};
    propiedades.forEach(prop => {
        if (prop in objeto) {
            resultado[prop] = objeto[prop];
        }
    });

    return resultado
}


module.exports = { infoUsuario }