const router = require("express").Router();
const eliminarEstudianteController = require("../controllers/eliminarEstudianteController")

router.delete('/:id', eliminarEstudianteController.eliminarEstudiante);
module.exports = router;

