const db = require("../bd/conexionBD")

const crearSeccion = async (req, res) => {
    try {
        const { nombre, seccion, id_profesor } = req.body;
        const [result] = await db.query(
            'INSERT INTO grados (nombre, seccion, id_profesor) VALUES (?, ?, ?)',
            [nombre, seccion, id_profesor || null]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el grado' });
    }
}

const obtenerSeccionConInfoProfesor = async (req, res) => {
    try {
        const [grados] = await db.query(`
      SELECT g.*, 
             p.primer_nombre as profesor_nombre, 
             p.primer_apellido as profesor_apellido,
             p.cedula as profesor_cedula
      FROM grados g
      LEFT JOIN personal p ON g.id_profesor = p.id
      ORDER BY g.nombre, g.seccion
    `);
        res.json(grados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los grados' });
    }
}

const asignarProfeSeccion = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_profesor } = req.body;

        await db.query(
            'UPDATE grados SET id_profesor = ? WHERE id = ?',
            [id_profesor, id]
        );

        res.json({ message: 'Profesor asignado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al asignar el profesor' });
    }
}

const profesoresDiponibles = async (req, res) => {
    try {
        const [profesores] = await db.query(`
      SELECT id, primer_nombre, primer_apellido, cedula 
      FROM personal 
      WHERE tipo = 'docente'
      ORDER BY primer_apellido, primer_nombre
    `);
        res.json(profesores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los profesores' });
    }
}

const agregarEstudianteSeccion = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_estudiante } = req.body;

        await db.query(
            'INSERT INTO grado_estudiantes (id_grado, id_estudiante) VALUES (?, ?)',
            [id, id_estudiante]
        );

        res.status(201).json({ message: 'Estudiante agregado al grado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el estudiante' });
    }
}

const obtenerEstudianteGrado = async (req, res) => {
    try {
        const { id } = req.params;

        const [estudiantes] = await db.query(`
      SELECT e.* 
      FROM estudiantes e
      JOIN grado_estudiantes ge ON e.id = ge.id_estudiante
      WHERE ge.id_grado = ?
      ORDER BY e.apellidos, e.nombres
    `, [id]);

        res.json(estudiantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
}

const estudiantesNoAsignados = async (req, res) => {
    try {
        const [estudiantes] = await db.query(`
      SELECT e.* 
      FROM estudiantes e
      LEFT JOIN grado_estudiantes ge ON e.id = ge.id_estudiante
      WHERE ge.id_estudiante IS NULL
      ORDER BY e.apellidos, e.nombres
    `);

        res.json(estudiantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los estudiantes disponibles' });
    }
}

const eliminarEstudiante = async (req, res) => {
    try {
        const { idGrado, idEstudiante } = req.params;

        await db.query(
            'DELETE FROM grado_estudiantes WHERE id_grado = ? AND id_estudiante = ?',
            [idGrado, idEstudiante]
        );

        res.json({ message: 'Estudiante removido del grado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al remover el estudiante' });
    }
}

const obtenerInfoCompletaGrado = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener información básica del grado y profesor
        const [gradoInfo] = await db.query(`
      SELECT g.*, 
             p.id as profesor_id,
             p.primer_nombre as profesor_nombre, 
             p.primer_apellido as profesor_apellido,
             p.cedula as profesor_cedula,
             p.telefono as profesor_telefono
      FROM grados g
      LEFT JOIN personal p ON g.id_profesor = p.id
      WHERE g.id = ?
    `, [id]);

        if (gradoInfo.length === 0) {
            return res.status(404).json({ error: 'Grado no encontrado' });
        }

        // Obtener estudiantes del grado
        const [estudiantes] = await db.query(`
      SELECT e.* 
      FROM estudiantes e
      JOIN grado_estudiantes ge ON e.id = ge.id_estudiante
      WHERE ge.id_grado = ?
      ORDER BY e.apellidos, e.nombres
    `, [id]);

        res.json({
            ...gradoInfo[0],
            estudiantes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los detalles del grado' });
    }
}



module.exports = {
    crearSeccion,
    obtenerSeccionConInfoProfesor,
    asignarProfeSeccion,
    profesoresDiponibles,
    agregarEstudianteSeccion,
    obtenerEstudianteGrado,
    estudiantesNoAsignados,
    eliminarEstudiante,
    obtenerInfoCompletaGrado
}