const router = require("express").Router();
const crearEstudianteController = require("../controllers/crearEstudianteController")

router.post("/", crearEstudianteController.crearEstudiante)

module.exports = router;