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

// Actualizar datos del usuario (excepto contraseña)
const updateUserData = async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, correo } = req.body;

    try {
        const [result] = await pool.query(
            `UPDATE usuarios 
       SET nombre = ?, usuario = ?, correo = ? 
       WHERE id = ?`,
            [nombre, usuario, correo, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Obtener datos actualizados
        const [updatedUser] = await pool.query(
            'SELECT id, nombre, usuario, correo, rol FROM usuarios WHERE id = ?',
            [id]
        );

        res.status(200).json({
            message: 'Datos actualizados correctamente',
            updatedUser: updatedUser[0]
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El correo o usuario ya existe' });
        }
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

// Cambiar contraseña
const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    console.log(id)
    try {
        // 1. Verificar contraseña actual
        console.log("2hola")

        const [user] = await pool.query(
            'SELECT contraseña FROM usuarios WHERE id = ?',
            [id]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user[0].contraseña);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña actual incorrecta' });
        }

        // 2. Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Actualizar en BD
        await pool.query(
            'UPDATE usuarios SET contraseña = ? WHERE id = ?',
            [hashedPassword, id]
        );

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar contraseña' });
    }
};

module.exports = {
    deleteUser,
    updateUser,
    createUser,
    getUsers,
    updateUserData,
    updatePassword
}