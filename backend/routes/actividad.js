const router = require("express").Router();
const upload = require('../middlewares/subirMiddleware');
const actividadController = require('../controllers/actividadController');

router.post('/', upload.any(), actividadController.crearActividad);
router.get('/', actividadController.obtenerTodasActividades);
router.delete('/:id', actividadController.eliminarActividad);

module.exports = router;