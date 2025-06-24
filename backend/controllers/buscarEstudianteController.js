const buscar = require("../models/buscarEstudiante")


const buscarEstudiante = async (req, res) => {
    try {
        const { cedula, cedula_escolar } = req.body;

        // Validación básica
        if (!cedula && !cedula_escolar) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar al menos un número de cédula o cédula escolar'
            });
        }

        const estudiante = await buscar.findByCedulaOrEscolar(cedula, cedula_escolar);

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró ningún estudiante con los datos proporcionados'
            });
        }

        // res.status(200).send(jsonResponse(200, {
        //     success: true,
        //     data: estudiante
        // }))

        res.json({
            success: true,
            data: estudiante
        });
    } catch (error) {
        console.error('Error en búsqueda por cédula:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar estudiante',
            error: error.message
        });
    }
}

const buscarPorId = async (req, res) => {
    try {
        const student = await buscar.getById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estudiante',
            error: error.message
        });
    }
}

module.exports = {
    buscarEstudiante,
    buscarPorId
}