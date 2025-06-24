const express = require("express");
const cors = require("cors");
const app = express();
const autenticar = require("./auth/autenticar");
const cookieParser = require('cookie-parser');
const path = require('path');

require("dotenv").config();

const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173', // Reemplaza con tu URL de frontend
    credentials: true, // Permite cookies/envío de credenciales
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json())
// app.use('/api/actividades', express.static(path.join(__dirname, '/uploads-actividades')));

app.use('/api/uploads-actividades', express.static(path.join(__dirname, 'uploads-actividades')));

app.use("/api/signup", require("./routes/signup"))
app.use("/api/login", require("./routes/login"))
app.use("/api/cerrar-sesion", require("./routes/cerrarSesion"))
app.use("/api/todos", autenticar, require("./routes/todos"))
app.use("/api/refresh-token", require("./routes/refreshToken"))
app.use("/api/usuario", autenticar, require("./routes/usuarios"))
app.use("/api/crear-estudiante", require("./routes/crearEstudiante"))
app.use("/api/buscar-estudiante", require("./routes/buscarEstudiante"))
app.use("/api/eliminar-estudiante", require("./routes/eliminarEstudiante"))
app.use("/api/editar-estudiante", require("./routes/editarEstudiantes"))
app.use("/api/estudiantes", require("./routes/estudianteRutas"))
app.use("/uploads", express.static("uploads"));
const uploadRoutes = require("./routes/subirArchivo");
app.use("/api", uploadRoutes);

app.use('/api/actividades', require("./routes/actividad"));



app.get("/", (req, res) => {
    res.send("Hola mundo papa");
})

app.listen(port, () => {
    console.log(`Servidor Ejecutado en el puerto:${port}`)
})