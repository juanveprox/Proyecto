const multer = require('multer');
const path = require('path');
const db = require('../bd/conexionBD'); // Asegúrate de tener configurada tu conexión a MySQL

// Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // La carpeta 'uploads' debe existir
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Validación de tipos de archivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf', // PDF
        'application/msword', // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/vnd.ms-excel', // XLS
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'text/csv' // CSV
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Tipo de archivo no permitido. Solo se aceptan PDF, Word o Excel');
        error.code = 'LIMIT_FILE_TYPES';
        return cb(error, false);
    }

    cb(null, true);
};

// Configuración de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 // Solo un archivo por vez
    }
}).single('file'); // 'file' es el nombre del campo en el formulario

// Función para subir archivos
exports.uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        // Manejo de errores de Multer
        if (err) {
            let message = 'Error al subir el archivo';

            if (err.code === 'LIMIT_FILE_SIZE') {
                message = 'El archivo es demasiado grande (máximo 5MB)';
            } else if (err.code === 'LIMIT_FILE_TYPES') {
                message = err.message;
            }

            return res.status(400).json({
                success: false,
                message: message
            });
        }

        // Verificar si se subió un archivo
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se seleccionó ningún archivo válido'
            });
        }

        // Validar que la descripción no exceda los 500 caracteres
        const description = req.body.description || '';
        if (description.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'La descripción no puede exceder los 500 caracteres'
            });
        }

        try {
            // Insertar en la base de datos
            const [result] = await db.query(
                `INSERT INTO archivos_subidos 
        (nombre_original, nombre_guardado, path, size, mime_type, description) 
        VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    req.file.originalname,
                    req.file.filename,
                    req.file.path,
                    req.file.size,
                    req.file.mimetype,
                    description.trim() || null // Guardar como NULL si está vacío
                ]
            );

            // Obtener el archivo recién insertado
            const [rows] = await db.query(
                'SELECT * FROM archivos_subidos WHERE id = ?',
                [result.insertId]
            );

            if (rows.length === 0) {
                throw new Error('No se pudo recuperar el archivo subido');
            }

            const uploadedFile = rows[0];

            // Respuesta exitosa
            res.json({
                success: true,
                message: 'Archivo subido correctamente',
                file: {
                    id: uploadedFile.id,
                    name: uploadedFile.nombre_original,
                    storedName: uploadedFile.nombre_guardado,
                    size: uploadedFile.size,
                    type: uploadedFile.mime_type,
                    description: uploadedFile.description,
                    createdAt: uploadedFile.created_at,
                    downloadUrl: `/uploads/${uploadedFile.nombre_guardado}`
                }
            });

        } catch (error) {
            console.error('Error en la base de datos:', error);

            // Eliminar el archivo subido si hubo error en la DB
            if (req.file) {
                const fs = require('fs');
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) console.error('Error eliminando archivo:', unlinkErr);
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al guardar la información del archivo en la base de datos',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });
};

// Función para obtener todos los archivos
exports.getFiles = async (req, res) => {
    try {
        // Opciones de paginación
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Obtener archivos con paginación
        const [files] = await db.query(
            `SELECT 
        id, 
        nombre_original, 
        nombre_guardado, 
        size, 
        mime_type, 
        description,
        created_at,
        CONCAT('/uploads/', nombre_guardado) as download_url
      FROM archivos_subidos 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        // Obtener conteo total
        const [[total]] = await db.query(
            'SELECT COUNT(*) as total FROM archivos_subidos'
        );

        res.json({
            success: true,
            data: files,
            pagination: {
                total: total.total,
                page,
                limit,
                totalPages: Math.ceil(total.total / limit)
            }
        });

    } catch (error) {
        console.error('Error al obtener archivos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los archivos',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Función para eliminar un archivo
exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener información del archivo
        const [rows] = await db.query(
            'SELECT * FROM archivos_subidos WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Archivo no encontrado'
            });
        }

        const file = rows[0];

        // Eliminar de la base de datos
        await db.query(
            'DELETE FROM archivos_subidos WHERE id = ?',
            [id]
        );

        // Eliminar el archivo físico
        const fs = require('fs');
        fs.unlink(file.path, (err) => {
            if (err) console.error('Error eliminando archivo físico:', err);
        });

        res.json({
            success: true,
            message: 'Archivo eliminado correctamente'
        });

    } catch (error) {
        console.error('Error eliminando archivo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el archivo',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};