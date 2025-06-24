const pool = require("../bd/conexionBD")

class BuscarEstudiante {
    static async findByCedulaOrEscolar(cedula, cedula_escolar) {
        const conexion = await pool.getConnection();
        try {
            let query = `
          SELECT 
            e.id,
            e.nombres,
            e.apellidos,
            e.fecha_nacimiento,
            e.genero,
            e.tipo_cedula,
            e.cedula,
            e.cedula_escolar,
            r.nombres as rep_nombres,
            r.apellidos as rep_apellidos,
            r.relacion,
            r.email,
            r.telefono as rep_telefono,
            r.ocupacion,
            r.tipo_cedula as rep_tipo_cedula,
            r.cedula as rep_cedula
          FROM estudiantes e
          JOIN representantes r ON e.representante_id = r.id
          WHERE e.cedula = ? OR e.cedula_escolar = ?
          LIMIT 1
        `;

            const [rows] = await conexion.query(query, [cedula, cedula_escolar]);
            return rows[0] || null;
        } finally {
            conexion.release();
        }
    }

    static async getById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
      SELECT 
        e.*, 
        r.nombres as rep_nombres, 
        r.apellidos as rep_apellidos, 
        r.relacion, 
        r.email, 
        r.telefono as rep_telefono, 
        r.ocupacion,
        r.tipo_cedula as rep_tipo_cedula,
        r.cedula as rep_cedula
      FROM estudiantes e
      JOIN representantes r ON e.representante_id = r.id
      WHERE e.id = ?
    `, [id]);

            return rows[0]; // Devuelve el primer registro o undefined
        } finally {
            connection.release();
        }
    }

}

module.exports = BuscarEstudiante;