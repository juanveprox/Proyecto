const fs = require('fs');
const path = require('path');
const Personal = require("../models/personalModel")

class PersonalController {
    constructor(pool) {
        this.personal = new Personal(pool); // Instancia la clase con 'new'
        this.pool = pool;
    }

    /** Registra nuevo personal con archivos adjuntos*/

    async registrarPersonal(req, res) {

        // console.log('Archivos recibidos:', req.files);
        const ruta = req.url
        const tipo = ruta.slice(1);

        const archivos = req.files || [];
        const datos = req.body;



        // Validación básica
        if (!['docentes', 'administrativos', 'obreros'].includes(tipo)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de personal no válido'
            });
        }

        try {

            // Validar cédula única
            const cedulaExiste = await this.personal.existeCedula(datos.cedula);
            if (cedulaExiste) {
                // Eliminar archivos subidos si la cédula existe
                archivos.forEach(archivo => fs.unlinkSync(archivo.path));
                return res.status(400).json({
                    success: false,
                    message: 'La cédula ya está registrada'
                });
            }
            // Crear registro principal
            const personalData = {
                tipo: tipo.slice(0, -1), // Remover 's' final
                ...datos,
                fechaNacimiento: new Date(datos.fechaNacimiento).toISOString().split('T')[0],
                fechaIngresoMPPE: new Date(datos.fechaIngresoMPPE).toISOString().split('T')[0]
            };
            const personalId = await this.personal.crear(personalData);
            console.log("perosonaID:", personalId)
            // Procesar archivos adjuntos
            if (archivos.length > 0) {
                for (const archivo of archivos) {
                    console.log("archivos: ", archivo)
                    await this.personal.agregarArchivo(personalId, {
                        nombreArchivo: archivo.filename,
                        rutaArchivo: archivo.path,
                        tipoArchivo: archivo.mimetype.startsWith('image/') ? 'imagen' : 'pdf'
                    });
                }
            }

            res.status(201).json({
                success: true,
                message: `${tipo.slice(0, -1)} registrado correctamente`,
                data: { id: personalId }
            });

        } catch (error) {
            console.error('Error al registrar personal:', error);

            // Eliminar archivos subidos en caso de error
            if (archivos.length > 0) {
                archivos.forEach(archivo => {
                    if (fs.existsSync(archivo.path)) {
                        fs.unlinkSync(archivo.path);
                    }
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al registrar el personal',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Obtiene todo el personal por tipo
     */
    async obtenerPersonal(req, res) {
        const ruta = req.url
        const tipo = ruta.slice(1);

        try {
            const personal = await this.personal.obtenerPorTipo(tipo.slice(0, -1));

            res.json({
                success: true,
                data: personal
            });

        } catch (error) {
            console.error('Error al obtener personal:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el personal'
            });
        }
    }

    /**Obtiene un personal específico por ID
     */
    async obtenerPersonalPorId(req, res) {
        const { id } = req.params;

        try {
            const personal = await this.personal.obtenerPorId(id);

            if (!personal) {
                return res.status(404).json({
                    success: false,
                    message: 'Personal no encontrado'
                });
            }

            res.json({
                success: true,
                data: personal
            });

        } catch (error) {
            console.error('Error al obtener personal:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el personal'
            });
        }
    }

    /**
     * Actualiza un registro de personal
     */
    async actualizarPersonal(req, res) {
        const { id } = req.params;
        const datos = req.body;
        const archivos = req.files || [];

        //Formatear la fecha a un formato yyyy/mm/dd
        function formatDateForDB(dateString) {
            if (!dateString) return null;

            const date = new Date(dateString);
            if (isNaN(date.getTime())) return null;

            // Formato YYYY-MM-DD compatible con MySQL
            return date.toISOString().split('T')[0];
        }


        try {
            // Validar cédula única (excluyendo el actual)
            if (datos.cedula) {
                const cedulaExiste = await this.personal.existeCedula(datos.cedula, id);
                if (cedulaExiste) {
                    return res.status(400).json({
                        success: false,
                        message: 'La cédula ya está registrada por otro personal'
                    });
                }
            }


            const actualizado = await this.personal.actualizar(id,
                {
                    ...datos,
                    fecha_nacimiento: datos.fecha_nacimiento
                        ? formatDateForDB(datos.fecha_nacimiento)
                        : null,
                    fecha_ingreso_mppe: datos.fecha_ingreso_mppe
                        ? formatDateForDB(datos.fecha_ingreso_mppe)
                        : null
                }
            );

            if (!actualizado) {
                return res.status(404).json({
                    success: false,
                    message: 'Personal no encontrado'
                });
            }
            if (archivos.length > 0) {
                for (const archivo of archivos) {
                    console.log("archivos: ", archivo)
                    await this.personal.agregarArchivo(id, {
                        nombreArchivo: archivo.filename,
                        rutaArchivo: archivo.path,
                        tipoArchivo: archivo.mimetype.startsWith('image/') ? 'imagen' : 'pdf'
                    });
                }
            }


            res.json({
                success: true,
                message: 'Personal actualizado correctamente'
            });

        } catch (error) {
            console.error('Error al actualizar personal:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el personal'
            });
        }
    }

    /**
     * Elimina un registro de personal
     */
    async eliminarPersonal(req, res) {
        const { id } = req.params;

        try {
            const { success, archivosEliminados } = await this.personal.eliminar(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Personal no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Personal eliminado correctamente',
                archivosEliminados
            });

        } catch (error) {
            console.error('Error al eliminar personal:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el personal'
            });
        }
    }

    /**
     * Agrega archivos a un registro existente
     */
    async agregarArchivos(req, res) {
        const { id } = req.params;
        const archivos = req.files || [];

        try {
            // Verificar que el personal existe
            const personal = await this.personal.obtenerPorId(id);
            if (!personal) {
                // Eliminar archivos subidos si el personal no existe
                archivos.forEach(archivo => fs.unlinkSync(archivo.path));
                return res.status(404).json({
                    success: false,
                    message: 'Personal no encontrado'
                });
            }

            // Obtener archivos existentes para validar límite
            const archivosExistentes = await this.personal.obtenerArchivos(id);
            if (archivosExistentes.length + archivos.length > 3) {
                archivos.forEach(archivo => fs.unlinkSync(archivo.path));
                return res.status(400).json({
                    success: false,
                    message: 'No se pueden tener más de 3 archivos por personal'
                });
            }

            // Agregar nuevos archivos
            for (const archivo of archivos) {
                await this.personal.agregarArchivo(id, {
                    nombreArchivo: archivo.originalname,
                    rutaArchivo: archivo.path,
                    tipoArchivo: archivo.mimetype.startsWith('image/') ? 'imagen' : 'pdf'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Archivos agregados correctamente',
                archivosAgregados: archivos.length
            });

        } catch (error) {
            console.error('Error al agregar archivos:', error);

            // Eliminar archivos subidos en caso de error
            archivos.forEach(archivo => {
                if (fs.existsSync(archivo.path)) {
                    fs.unlinkSync(archivo.path);
                }
            });

            res.status(500).json({
                success: false,
                message: 'Error al agregar archivos'
            });
        }
    }

    /**
     * Elimina un archivo específico
     */
    async eliminarArchivo(req, res) {
        const { id, fileId } = req.params;

        try {
            // Verificar que el personal existe
            const personal = await this.personal.obtenerPorId(id);
            if (!personal) {
                return res.status(404).json({
                    success: false,
                    message: 'Personal no encontrado'
                });
            }


            // Obtener información del archivo
            const [archivos] = await this.pool.query(
                `SELECT ruta_archivo FROM personal_archivos 
         WHERE id = ? AND personal_id = ?`,
                [fileId, id]
            );

            if (archivos.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Archivo no encontrado'
                });
            }

            // Eliminar de la base de datos
            await this.pool.query(
                `DELETE FROM personal_archivos WHERE id = ?`,
                [fileId]
            );

            console.log("ruta", archivos[0].ruta_archivo)

            // Eliminar archivo físico
            if (fs.existsSync(archivos[0].ruta_archivo)) {
                fs.unlinkSync(archivos[0].ruta_archivo);
            }

            res.json({
                success: true,
                message: 'Archivo eliminado correctamente'
            });

        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el archivo'
            });
        }
    }
}

module.exports = PersonalController;