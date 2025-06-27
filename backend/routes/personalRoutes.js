
const router = require("express").Router();
const upload = require('../lib/multerGuardarImgPersonal');
const PersonalController = require('../controllers/personalController');
const pool = require('../bd/conexionBD');

// Middleware de autenticación (opcional)
// const authMiddleware = require('../middlewares/authMiddleware');

// Instancia del controlador
const personalController = new PersonalController(pool);

router.post('/docentes', upload.any('archivos', 3), (req, res) => personalController.registrarPersonal(req, res));
router.post('/administrativos', upload.any('archivos', 3), (req, res) => personalController.registrarPersonal(req, res));
router.post('/obreros', upload.any('archivos', 3), (req, res) => personalController.registrarPersonal(req, res));


// Rutas para obtener personal
router.get('/docentes', (req, res) => personalController.obtenerPersonal(req, res));
router.get('/administrativos', (req, res) => personalController.obtenerPersonal(req, res));
router.get('/obreros', (req, res) => personalController.obtenerPersonal(req, res));

// Rutas para operaciones individuales
router.get('/:id', (req, res) => personalController.obtenerPersonalPorId(req, res));
router.put('/:id', upload.any('archivos', 3), (req, res) => personalController.actualizarPersonal(req, res));
router.delete('/:id', (req, res) => personalController.eliminarPersonal(req, res));
router.delete('/:id/archivos/:fileId', (req, res) => personalController.eliminarArchivo(req, res))


module.exports = router;