const pool = require('../bd/conexionBD');
const { deleteUploadedFiles } = require('../lib/servicioArchivos');
const fs = require('fs');
const path = require('path');

const crearActividad = async (req, res) => {


    const { titulo, descripcion } = req.body;
    const imagenes = req.files;

    if (!titulo || !descripcion) {
        deleteUploadedFiles(imagenes);
        return res.status(400).json({
            success: false,
            message: 'El título y la descripción son requeridos'
        });
    }

    if (!imagenes || imagenes.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Debes subir al menos una imagen'
        });
    }
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Insertar actividad
        const [actividadResult] = await connection.execute(
            `INSERT INTO actividades (titulo, descripcion) 
       VALUES (?, ?)`,
            [titulo, descripcion]
        );

        const actividadId = actividadResult.insertId;
        const imagenesGuardadas = [];

        // Insertar imágenes
        for (const imagen of imagenes) {
            const imagenPath = `/uploads-actividades/${imagen.filename}`;

            await connection.execute(
                `INSERT INTO actividad_imagenes (actividad_id, imagen_url) 
         VALUES (?, ?)`,
                [actividadId, imagenPath]
            );

            imagenesGuardadas.push(imagenPath);
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Actividad creada exitosamente',
            data: {
                id: actividadId,
                titulo,
                descripcion,
                imagenes: imagenesGuardadas
            }
        });

    } catch (error) {
        if (connection) await connection.rollback();
        deleteUploadedFiles(imagenes);

        console.error('Error al crear actividad:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la actividad',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (connection) connection.release();
    }
};

const obtenerTodasActividades = async (req, res) => {

    let connection;
    try {
        connection = await pool.getConnection();

        // Obtener todas las actividades
        const [actividades] = await connection.query(
            `SELECT id, titulo, descripcion, 
       DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_creacion
       FROM actividades ORDER BY fecha_creacion DESC`
        );

        // Obtener imágenes para cada actividad
        for (const actividad of actividades) {
            const [imagenes] = await connection.query(
                `SELECT id, imagen_url 
         FROM actividad_imagenes 
         WHERE actividad_id = ?`,
                [actividad.id]
            );
            actividad.imagenes = imagenes;
        }

        res.status(200).json({
            success: true,
            data: actividades
        });

    } catch (error) {
        console.error('Error al obtener actividades:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las actividades',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (connection) connection.release();
    }
};


const eliminarActividad = async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Obtener las imágenes asociadas
        const [imagenes] = await connection.query(
            'SELECT imagen_url FROM actividad_imagenes WHERE actividad_id = ?',
            [id]
        );

        // 2. Eliminar registros de imágenes de la base de datos
        await connection.query(
            'DELETE FROM actividad_imagenes WHERE actividad_id = ?',
            [id]
        );

        // 3. Eliminar la actividad
        const [result] = await connection.query(
            'DELETE FROM actividades WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            throw new Error('Actividad no encontrada');
        }

        // 4. Eliminar archivos físicos

        imagenes.forEach(imagen => {
            const projectRoot = path.dirname(__dirname);
            const filePath = path.join(projectRoot, imagen.imagen_url);
            console.log(filePath)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'Actividad eliminada correctamente'
        });

    } catch (error) {
        if (connection) await connection.rollback();

        console.error('Error al eliminar actividad:', error);
        res.status(error.message === 'Actividad no encontrada' ? 404 : 500).json({
            success: false,
            message: error.message || 'Error al eliminar la actividad'
        });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    crearActividad,
    obtenerTodasActividades,
    eliminarActividad
};