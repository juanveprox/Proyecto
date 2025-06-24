const router = require("express").Router();
const buscarEstudianteController = require("../controllers/buscarEstudianteController")


router.post("/", buscarEstudianteController.buscarEstudiante)
router.get("/:id", buscarEstudianteController.buscarPorId)

module.exports = router;