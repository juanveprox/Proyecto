const express = require("express");
const cors = require("cors");
const app = express();
const autenticar = require("./auth/autenticar");
const cookieParser = require('cookie-parser');
const path = require('path');
const pool = require("./bd/conexionBD")

require("dotenv").config();

const port = process.env.PORT || 3000;

// Configuración de Seguridad Mejorada
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Aumentado para soportar archivos
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//  Configuración de Rutas de Archivos Estáticos
app.use('/api/uploads-actividades', express.static(path.join(__dirname, 'uploads-actividades')));
app.use('/api/uploads-personal', express.static(path.join(__dirname, 'uploads/personal'))); // Nueva ruta para personal
app.use('/uploads', express.static("uploads"));

// Rutas de Autenticación y Usuarios
app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/cerrar-sesion", require("./routes/cerrarSesion"));
app.use("/api/refresh-token", require("./routes/refreshToken"));
app.use("/api/usuario", autenticar, require("./routes/usuarios"));

// Rutas de Estudiantes
app.use("/api/crear-estudiante", require("./routes/crearEstudiante"));
app.use("/api/buscar-estudiante", require("./routes/buscarEstudiante"));
app.use("/api/eliminar-estudiante", require("./routes/eliminarEstudiante"));
app.use("/api/editar-estudiante", require("./routes/editarEstudiantes"));
app.use("/api/estudiantes", require("./routes/estudianteRutas"));

//  Rutas de Actividades y Archivos
const uploadRoutes = require("./routes/subirArchivo");
app.use("/api", uploadRoutes);
app.use("/api/actividades", require("./routes/actividad"));

//  Integración del PersonalRouter
const personalRouter = require("./routes/personalRoutes");
app.use("/api/personal", personalRouter); // Protegido con autenticación (autenticar,)

//!OJO
// app.get('/api/profesores', async (req, res) => {
//     const { search } = req.query;

//     try {
//         let query = `SELECT 
//                   id, 
//                   primer_nombre AS nombre, 
//                   primer_apellido AS apellido, 
//                   cedula 
//                 FROM personal 
//                 WHERE tipo = 'docente'`;
//         const params = [];

//         if (search) {
//             query += ' AND (primer_nombre LIKE ? OR primer_apellido LIKE ? OR cedula LIKE ?)';
//             const searchTerm = `%${search}%`;
//             params.push(searchTerm, searchTerm, searchTerm);
//         }

//         query += ' ORDER BY primer_apellido, primer_nombre LIMIT 50';

//         const [profesores] = await pool.query(query, params);
//         res.json(profesores);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// app.get('/api/estudiantes', async (req, res) => {
//     const { search } = req.query;

//     try {
//         let query = 'SELECT id, nombres AS nombre, apellidos AS apellido, cedula_escolar, genero AS sexo FROM estudiantes';
//         const params = [];

//         if (search) {
//             query += ' WHERE nombres LIKE ? OR apellidos LIKE ? OR cedula_escolar LIKE ?';
//             const searchTerm = `%${search}%`;
//             params.push(searchTerm, searchTerm, searchTerm);
//         }

//         query += ' ORDER BY apellidos, nombres LIMIT 50';

//         const [estudiantes] = await pool.query(query, params);
//         res.json(estudiantes);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

//!Ruta secciones
//! app.use("/api/secciones", require("./routes/seccionesRoute"))

//Ruta de las secciones (grados)
app.use("/api/grados", require("./routes/seccionesRouter"))

// Ruta de Bienvenida y Manejo de Errores
app.get("/api", (req, res) => {
    res.json({
        status: "success",
        message: "API del Sistema de Gestión Educativa",
        endpoints: {
            auth: "/api/login, /api/signup",
            estudiantes: "/api/estudiantes",
            personal: "/api/personal",
            actividades: "/api/actividades"
        }
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Error interno del servidor",
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// 8. Inicio del Servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto: ${port}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});