const { crearEstudianteBD } = require("../bd/crearEstudianteBD.JS")

const crearEstudiante = async (req, res) => {
    const { student, guardian } = req.body;

    try {

        const resultado = await crearEstudianteBD(student, guardian)
        console.log(resultado)

        res.status(201).json({
            success: true,
            message: resultado.representanteExistente
                ? 'Estudiante registrado con representante existente'
                : 'Registro completo exitoso',
            data: resultado
        });
    } catch (error) {
        console.error('Error en el endpoint:', error);
        res.status(error.error?.code === 'ER_DUP_ENTRY' ? 409 : 500).json(error);
    }

};


module.exports = {
    crearEstudiante
}