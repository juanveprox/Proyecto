const express = require("express");
const cors = require("cors");
const app = express();
const autenticar = require("./auth/autenticar");
const cookieParser = require('cookie-parser');

require("dotenv").config();

const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173', // Reemplaza con tu URL de frontend
    credentials: true, // Permite cookies/envío de credenciales
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json())

app.use("/api/signup", require("./routes/signup"))
app.use("/api/login", require("./routes/login"))
app.use("/api/cerrar-sesion", require("./routes/cerrarSesion"))
app.use("/api/todos", autenticar, require("./routes/todos"))
app.use("/api/refresh-token", require("./routes/refreshToken"))
app.use("/api/usuario", autenticar, require("./routes/usuarios"))

app.get("/", (req, res) => {
    res.send("Hola mundo papa");
})

app.listen(port, () => {
    console.log(`Servidor Ejecutado en el puerto:${port}`)
})