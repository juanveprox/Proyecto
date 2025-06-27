const express = require("express");
const cors = require("cors");
const app = express();
const autenticar = require("./auth/autenticar");
const cookieParser = require('cookie-parser');
const path = require('path');

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
app.use("/api", require("./routes/subirArchivo"));
app.use("/api/actividades", require("./routes/actividad"));

//  Integración del PersonalRouter
app.use("/api/personal", require("./routes/personalRoutes")); // Protegido con autenticación (autenticar,)

//Ruta de las secciones (grados)
app.use("/api/grados", require("./routes/seccionesRouter"))

//Ruta obtener informacion de todos los registrados
app.use("/api/estadistica", require("./routes/obtenerEstadisticaRouter"))

//Ruta editar usuarios
app.use("/api/users", require("./routes/usersRouter"))

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
    console.log(`Entorno: ${process.env.NODE_ENV || 'Desarrollo'}`);
});