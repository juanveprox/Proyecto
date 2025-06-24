const pool = require("../bd/conexionBD")

async function crearEstudianteBD(student, guardian) {

    let conexion;

    // console.log(student)
    // console.log(guardian)
    try {

        conexion = await pool.getConnection();

        await conexion.beginTransaction();

        // if (student.Cedula == "" || student.Cedula == undefined) {
        //     student.Cedula = null;
        // }
        // if (student.tipoCedula == "" || student.tipoCedula == undefined) {
        //     student.tipoCedula = null;
        // }



        //Verificar si el representante ya existe por cédula
        const [representanteExistente] = await conexion.execute(
            `SELECT id FROM representantes WHERE cedula = ? LIMIT 1`,
            [guardian.cedula]
        );

        let representanteId;

        if (representanteExistente.length > 0) {
            // Representante existe, usar su ID
            representanteId = representanteExistente[0].id;
            console.log(`Usando representante existente con ID: ${representanteId}`);
        } else {

            //Insertamo un nuevo representante si no existe
            const [representanteResult] = await conexion.execute(
                `INSERT INTO representantes 
          (nombres, apellidos, relacion, email, telefono, ocupacion, tipo_cedula, cedula) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    guardian.nombres,
                    guardian.apellidos,
                    guardian.relacion,
                    guardian.email,
                    guardian.phone,
                    guardian.ocupacion,
                    guardian.tipoCedula,
                    guardian.cedula
                ]
            );

            representanteId = representanteResult.insertId;
            console.log(`Nuevo representante insertado con ID: ${representanteId}`);
        }
        console.log("---------------------------------")
        console.log(student.cedula.length)
        console.log(student.cedulaEscolar.length)

        //Verificar si el estudiante ya existe por cédula o cédula escolar

        if (student.cedula.length == 0 && student.cedulaEscolar.length > 1) {
            var [estudianteExistente] = await conexion.execute(
                `SELECT id FROM estudiantes WHERE cedula_escolar = ? LIMIT 1`,
                [student.cedulaEscolar]
            );

        } else if (student.cedula.length > 0 && student.cedulaEscolar.length == 0) {
            var [estudianteExistente] = await conexion.execute(
                `SELECT id FROM estudiantes WHERE cedula = ? LIMIT 1`,
                [student.cedula]
            );
        }


        console.log("Heer")
        console.log(typeof (estudianteExistente))

        if (estudianteExistente.length > 0) {
            throw {
                code: 'ER_DUP_ENTRY',
                sqlMessage: 'Estudiante ya registrado con cedula escolar o cedula',
                duplicateField: estudianteExistente[0].cedula === student.cedula
                    ? 'estudiantes.cedula'
                    : 'estudiantes.cedula_escolar'
            };
        }


        const [estudianteResult] = await conexion.execute(
            `INSERT INTO estudiantes 
          (nombres, apellidos, fecha_nacimiento, genero, tipo_cedula, cedula, cedula_escolar, representante_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student.nombres,
                student.apellidos,
                student.fechaNacimiento,
                student.genero,
                student.tipoCedula || null,
                student.cedula || null,
                student.cedulaEscolar,
                representanteId
            ]
        );

        await conexion.commit();

        return {
            success: true,
            message: 'Estudiante registrado exitosamente',
            estudianteId: estudianteResult.insertId,
            representanteId: representanteId,
            representanteExistente: representanteExistente.length > 0
        };


    } catch (error) {
        if (conexion) await conexion.rollback();

        // console.error('Error al registrar estudiante:', error);

        let errorResponse = {
            success: false,
            message: 'Error al procesar el registro',
            error: {
                code: error.code || 'UNKNOWN_ERROR',
                message: error.message,
                sqlMessage: error.sqlMessage
            }
        };


        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('representantes.cedula')) {
                errorResponse.message = 'Ya existe un representante con esta cédula';
                errorResponse.error.field = 'cedula_representante';
            } else if (error.sqlMessage.includes('estudiantes.cedula')) {
                errorResponse.message = 'Ya existe un estudiante con esta cédula';
                errorResponse.error.field = 'cedula_estudiante';
            } else if (error.sqlMessage.includes('estudiantes.cedula_escolar')) {
                errorResponse.message = 'Ya existe un estudiante con esta cédula escolar';
                errorResponse.error.field = 'cedula_escolar';
            }
        }

        throw errorResponse;

    } finally {
        if (conexion) conexion.release()
    }

}

module.exports = {
    crearEstudianteBD
}