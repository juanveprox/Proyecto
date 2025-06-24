const router = require("express").Router();
const estudianteController = require("../controllers/estudianteController")


router.get('/buscar-todos/', estudianteController.buscarTodoEstudiantes);


module.exports = router;
