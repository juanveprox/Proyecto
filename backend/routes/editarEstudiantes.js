const router = require("express").Router();
const editarEstudiantesController = require("../controllers/editarEstudianteController")

router.put('/:id', editarEstudiantesController.editarEstudiantes);
module.exports = router;

