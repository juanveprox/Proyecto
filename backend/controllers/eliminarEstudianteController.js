const pool = require("../bd/conexionBD")


const eliminarEstudiante = async (req, res) => {
    console.log("Eliminando Elemento")

    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Primero obtenemos el representante_id del estudiante
            const [student] = await connection.query(
                'SELECT representante_id FROM estudiantes WHERE id = ?',
                [req.params.id]
            );

            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Estudiante no encontrado'
                });
            }

            const representanteId = student[0].representante_id;

            // 2. Eliminamos el estudiante
            await connection.query(
                'DELETE FROM estudiantes WHERE id = ?',
                [req.params.id]
            );

            // 3. Eliminamos el representante (si no tiene otros estudiantes asociados)
            const [otherStudents] = await connection.query(
                'SELECT id FROM estudiantes WHERE representante_id = ?',
                [representanteId]
            );

            if (otherStudents.length === 0) {
                await connection.query(
                    'DELETE FROM representantes WHERE id = ?',
                    [representanteId]
                );
            }

            await connection.commit();

            res.json({
                success: true,
                message: 'Estudiante eliminado correctamente'
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error eliminando estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar estudiante',
            error: error.message
        });
    }
};


module.exports = {
    eliminarEstudiante
}