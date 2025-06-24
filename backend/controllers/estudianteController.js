const pool = require("../bd/conexionBD")

const buscarTodoEstudiantes = async (req, res) => {
    try {
        // Obtener parámetros de consulta
        const { page = 1, limit = 10, search, sortBy = 'apellidos', sortOrder = 'asc', exportAll } = req.query;

        const finalLimit = exportAll ? 10000 : limit;
        const finalPage = exportAll ? 1 : page;
        const offset = (finalPage - 1) * finalLimit;


        // Construir consulta base
        let query = `
      SELECT 
        e.id,
        e.nombres,
        e.apellidos,
        e.cedula,
        e.cedula_escolar,
        e.genero,
        e.fecha_nacimiento,
        r.nombres as rep_nombres,
        r.apellidos as rep_apellidos,
        r.cedula as rep_cedula,
        r.telefono as rep_telefono
      FROM estudiantes e
      JOIN representantes r ON e.representante_id = r.id
    `;

        const params = [];

        // Añadir filtro de búsqueda si existe
        if (search) {
            query += `
        WHERE e.nombres LIKE ? 
        OR e.apellidos LIKE ? 
        OR e.cedula LIKE ? 
        OR e.cedula_escolar LIKE ?
        OR r.nombres LIKE ?
        OR r.apellidos LIKE ?
      `;
            const searchTerm = `%${search}%`;
            params.push(...Array(6).fill(searchTerm));
        }

        // Añadir ordenamiento
        query += ` ORDER BY ${sortBy} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;

        // Añadir paginación
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        // Ejecutar consulta
        const [students] = await pool.query(query, params);

        // Obtener conteo total para paginación
        const [total] = await pool.query('SELECT COUNT(*) as total FROM estudiantes');

        if (exportAll) {
            return res.json(students);
        }

        res.json({
            success: true,
            data: students,
            pagination: {
                total: total[0].total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total[0].total / limit)
            }
        });
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estudiantes',
            error: error.message
        });
    }
};


module.exports = {
    buscarTodoEstudiantes
}