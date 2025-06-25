const fs = require('fs');
const path = require('path');

class Personal {
    constructor(pool) {
        this.pool = pool;
    }

    /**
     * Crea un nuevo registro de personal
     * @param {Object} personalData - Datos del personal
     * @returns {Promise<number>} ID del nuevo registro
     */
    async crear(personalData) {
        const [result] = await this.pool.execute(
            `INSERT INTO personal (
        tipo, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
        cedula, telefono, correo, fecha_nacimiento, sexo, cargo_voucher,
        codigo_cargo, dependencia, codigo_dependencia, carga_horaria,
        fecha_ingreso_mppe, titulos_profesionales, tipo_titulo,
        talla_franela, talla_pantalon, talla_zapato
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                personalData.tipo,
                personalData.primerNombre || null,
                personalData.segundoNombre || null,
                personalData.primerApellido || null,
                personalData.segundoApellido || null,
                personalData.cedula || null,
                personalData.telefono || null,
                personalData.correo || null,
                personalData.fechaNacimiento || null,
                personalData.sexo || null,
                personalData.cargoVoucher || null,
                personalData.codigoCargo || null,
                personalData.dependencia || null,
                personalData.codigoDependencia || null,
                personalData.cargaHoraria || null,
                personalData.fechaIngresoMPPE || null,
                personalData.titulosProfesionales || null,
                personalData.tipoTitulo || null,
                personalData.tallaFranela || null,
                personalData.tallaPantalon || null,
                personalData.tallaZapato || null
            ]
        );
        return result.insertId;
    }

    /**
     * Agrega un archivo adjunto a un registro de personal
     * @param {number} personalId - ID del personal
     * @param {Object} archivoData - Datos del archivo
     * @returns {Promise<void>}
     */
    async agregarArchivo(personalId, archivoData) {
        await this.pool.execute(
            `INSERT INTO personal_archivos (
        personal_id, nombre_archivo, ruta_archivo, tipo_archivo
      ) VALUES (?, ?, ?, ?)`,
            [
                personalId,
                archivoData.nombreArchivo,
                archivoData.rutaArchivo,
                archivoData.tipoArchivo
            ]
        );
    }

    /**
     * Obtiene todo el personal por tipo
     * @param {string} tipo - Tipo de personal (docente, administrativo, obrero)
     * @returns {Promise<Array>}
     */
    async obtenerPorTipo(tipo) {
        const [rows] = await this.pool.query(
            `SELECT * FROM personal WHERE tipo = ? ORDER BY primer_apellido`,
            [tipo]
        );
        return rows;
    }

    /**
     * Obtiene un registro de personal por ID con sus archivos
     */
    async obtenerPorId(id) {
        const [personal] = await this.pool.query(
            `SELECT * FROM personal WHERE id = ?`,
            [id]
        );

        if (personal.length === 0) return null;

        const [archivos] = await this.pool.query(
            `SELECT id, nombre_archivo, ruta_archivo, tipo_archivo 
       FROM personal_archivos 
       WHERE personal_id = ?`,
            [id]
        );

        return {
            ...personal[0],
            archivos: archivos.map(archivo => ({
                ...archivo,
                url: `/uploads/personal/${path.basename(archivo.ruta_archivo)}`
            }))
        };
    }

    /**
     * Actualiza un registro de personal
     * ID del personal
     *  Datos a actualizar
     * 
     */
    async actualizar(id, datos) {
        const [result] = await this.pool.execute(
            `UPDATE personal SET
        primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?,
        telefono = ?, correo = ?, fecha_nacimiento = ?, sexo = ?, cargo_voucher = ?,
        codigo_cargo = ?, dependencia = ?, codigo_dependencia = ?, carga_horaria = ?,
        fecha_ingreso_mppe = ?, titulos_profesionales = ?, tipo_titulo = ?,
        talla_franela = ?, talla_pantalon = ?, talla_zapato = ?
       WHERE id = ?`,
            [
                datos.primer_nombre,
                datos.segundo_nombre || null,
                datos.primer_apellido,
                datos.segundo_apellido || null,
                datos.telefono || null,
                datos.correo || null,
                datos.fecha_nacimiento,
                datos.sexo,
                datos.cargo_voucher,
                datos.codigo_cargo,
                datos.dependencia,
                datos.codigo_dependencia,
                datos.carga_horaria,
                datos.fecha_ingreso_mppe,
                datos.titulos_profesionales || null,
                datos.tipo_titulo || null,
                datos.talla_franela || null,
                datos.talla_pantalon || null,
                datos.talla_zapato || null,
                id
            ]
        );
        return result.affectedRows > 0;
    }

    /**
     * Elimina un registro de personal y sus archivos
     *  ID del personal
     * 
     */
    async eliminar(id) {
        let connection;
        try {
            connection = await this.pool.getConnection();
            await connection.beginTransaction();

            // Obtener archivos para eliminación física
            const [archivos] = await connection.query(
                `SELECT ruta_archivo FROM personal_archivos WHERE personal_id = ?`,
                [id]
            );

            // Eliminar registros de archivos
            await connection.query(
                `DELETE FROM personal_archivos WHERE personal_id = ?`,
                [id]
            );

            // Eliminar registro principal
            const [result] = await connection.query(
                `DELETE FROM personal WHERE id = ?`,
                [id]
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return { success: false, archivosEliminados: 0 };
            }

            await connection.commit();

            // Eliminar archivos físicos
            let archivosEliminados = 0;
            archivos.forEach(archivo => {
                try {
                    if (fs.existsSync(archivo.ruta_archivo)) {
                        fs.unlinkSync(archivo.ruta_archivo);
                        archivosEliminados++;
                    }
                } catch (err) {
                    console.error(`Error eliminando archivo ${archivo.ruta_archivo}:`, err);
                }
            });

            return { success: true, archivosEliminados };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    /**
     * Verifica si una cédula ya existe
     * Número de cédula
     * - ID a excluir (para actualizaciones)
     * 
     */
    async existeCedula(cedula, excludeId = null) {
        let query = `SELECT id FROM personal WHERE cedula = ?`;
        const params = [cedula];

        if (excludeId) {
            query += ` AND id != ?`;
            params.push(excludeId);
        }

        const [rows] = await this.pool.query(query, params);
        return rows.length > 0;
    }

    /**
     * Obtiene los archivos de un personal - ID del personal
     */
    async obtenerArchivos(personalId) {
        const [archivos] = await this.pool.query(
            `SELECT id, nombre_archivo, tipo_archivo 
       FROM personal_archivos 
       WHERE personal_id = ?`,
            [personalId]
        );
        return archivos;
    }
}

module.exports = Personal;