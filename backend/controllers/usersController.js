const bcrypt = require("bcrypt")
const pool = require("../bd/conexionBD")

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, usuario, correo, rol FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
    const { nombre, usuario, correo, password, rol } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO usuarios (nombre, usuario, correo, password, rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, usuario, correo, hashedPassword, rol]
        );
        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear usuario', error: error.message });
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, correo, rol } = req.body;

    try {
        await pool.query(
            'UPDATE usuarios SET nombre = ?, usuario = ?, correo = ?, rol = ? WHERE id = ?',
            [nombre, usuario, correo, rol, id]
        );
        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar usuario' });
    }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar usuario' });
    }
};


module.exports = {
    deleteUser,
    updateUser,
    createUser,
    getUsers
}