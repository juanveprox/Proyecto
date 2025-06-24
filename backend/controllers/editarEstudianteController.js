const pool = require("../bd/conexionBD")

const editarEstudiantes = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { student, guardian } = req.body;
        const studentId = req.params.id;

        // 1. Obtener el representante_id actual
        const [currentStudent] = await connection.query(
            'SELECT representante_id FROM estudiantes WHERE id = ?',
            [studentId]
        );

        if (currentStudent.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        const representanteId = currentStudent[0].representante_id;

        // 2. Actualizar representante
        await connection.query(
            `UPDATE representantes SET
        nombres = ?,
        apellidos = ?,
        relacion = ?,
        email = ?,
        telefono = ?,
        ocupacion = ?,
        tipo_cedula = ?,
        cedula = ?
      WHERE id = ?`,
            [
                guardian.nombres,
                guardian.apellidos,
                guardian.relacion,
                guardian.email,
                guardian.phone,
                guardian.ocupacion,
                guardian.tipoCedula,
                guardian.cedula,
                representanteId
            ]
        );

        // 3. Actualizar estudiante
        await connection.query(
            `UPDATE estudiantes SET
        nombres = ?,
        apellidos = ?,
        fecha_nacimiento = ?,
        genero = ?,
        tipo_cedula = ?,
        cedula = ?,
        cedula_escolar = ?
      WHERE id = ?`,
            [
                student.nombres,
                student.apellidos,
                student.fechaNacimiento,
                student.genero,
                student.tipoCedula,
                student.cedula || null,
                student.cedulaEscolar,
                studentId
            ]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Estudiante actualizado correctamente'
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error actualizando estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estudiante',
            error: error.message
        });
    } finally {
        connection.release();
    }
};


module.exports = {
    editarEstudiantes
}