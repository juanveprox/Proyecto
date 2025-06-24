const db = require('../bd/conexionBD');

class Actividad {
    static async create({ titulo, descripcion, imagenes }) {
        const [result] = await db.query(
            'INSERT INTO actividades (titulo, descripcion, imagenes) VALUES (?, ?, ?)',
            [titulo, descripcion, JSON.stringify(imagenes)]
        );
        return this.getById(result.insertId);
    }

    static async getById(id) {
        const [rows] = await db.query(
            'SELECT * FROM actividades WHERE id = ?',
            [id]
        );
        if (rows.length === 0) return null;

        const actividad = rows[0];
        actividad.imagenes = JSON.parse(actividad.imagenes || '[]');
        return actividad;
    }

    static async getAll() {
        const [rows] = await db.query(
            'SELECT * FROM actividades ORDER BY created_at DESC'
        );
        return rows.map(row => ({
            ...row,
            imagenes: JSON.parse(row.imagenes || '[]')
        }));
    }

    static async update(id, { titulo, descripcion, imagenes }) {
        await db.query(
            'UPDATE actividades SET titulo = ?, descripcion = ?, imagenes = ? WHERE id = ?',
            [titulo, descripcion, JSON.stringify(imagenes), id]
        );
        return this.getById(id);
    }

    static async delete(id) {
        const actividad = await this.getById(id);
        if (!actividad) return null;

        await db.query(
            'DELETE FROM actividades WHERE id = ?',
            [id]
        );
        return actividad;
    }
}

module.exports = Actividad;