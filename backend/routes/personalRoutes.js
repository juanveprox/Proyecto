
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


/**
 * @swagger
 * tags:
 *   name: Personal
 *   description: Gestión de personal docente, administrativo y obrero
 */

/**
 * @swagger
 * /api/personal/{tipo}:
 *   post:
 *     summary: Registra nuevo personal
 *     tags: [Personal]
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [docentes, administrativos, obreros]
 *         description: Tipo de personal a registrar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               primerNombre:
 *                 type: string
 *               segundoNombre:
 *                 type: string
 *               primerApellido:
 *                 type: string
 *               cedula:
 *                 type: string
 *               archivos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - primerNombre
 *               - primerApellido
 *               - cedula
 *     responses:
 *       201:
 *         description: Personal registrado exitosamente
 *       400:
 *         description: Datos inválidos o cédula duplicada
 *       500:
 *         description: Error del servidor
 */
// router.post(
//     '/:tipo(docentes|administrativos|obreros)',
//     // authMiddleware,
//     upload.array('archivos', 3),
//     personalController.registrarPersonal
// );

// /**
//  * @swagger
//  * /api/personal/{tipo}:
//  *   get:
//  *     summary: Obtiene listado de personal por tipo
//  *     tags: [Personal]
//  *     parameters:
//  *       - in: path
//  *         name: tipo
//  *         required: true
//  *         schema:
//  *           type: string
//  *           enum: [docentes, administrativos, obreros]
//  *         description: Tipo de personal a listar
//  *     responses:
//  *       200:
//  *         description: Listado de personal
//  *       500:
//  *         description: Error del servidor
//  */
// router.get(
//     '/:tipo(docentes|administrativos|obreros)',
//     // authMiddleware,
//     personalController.obtenerPersonal
// );

// /**
//  * @swagger
//  * /api/personal/{id}:
//  *   get:
//  *     summary: Obtiene detalles de un personal específico
//  *     tags: [Personal]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID del personal
//  *     responses:
//  *       200:
//  *         description: Detalles del personal
//  *       404:
//  *         description: Personal no encontrado
//  *       500:
//  *         description: Error del servidor
//  */
// router.get(
//     '/:id',
//     // authMiddleware,
//     personalController.obtenerPersonalPorId
// );

// /**
//  * @swagger
//  * /api/personal/{id}:
//  *   put:
//  *     summary: Actualiza información de personal
//  *     tags: [Personal]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID del personal a actualizar
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Personal'
//  *     responses:
//  *       200:
//  *         description: Personal actualizado
//  *       400:
//  *         description: Datos inválidos
//  *       404:
//  *         description: Personal no encontrado
//  *       500:
//  *         description: Error del servidor
//  */
// router.put(
//     '/:id',
//     // authMiddleware,
//     personalController.actualizarPersonal
// );

// /**
//  * @swagger
//  * /api/personal/{id}:
//  *   delete:
//  *     summary: Elimina un registro de personal
//  *     tags: [Personal]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID del personal a eliminar
//  *     responses:
//  *       200:
//  *         description: Personal eliminado
//  *       404:
//  *         description: Personal no encontrado
//  *       500:
//  *         description: Error del servidor
//  */
// router.delete(
//     '/:id',
//     // authMiddleware,
//     personalController.eliminarPersonal
// );

// /**
//  * @swagger
//  * /api/personal/{id}/archivos:
//  *   post:
//  *     summary: Agrega archivos a un personal existente
//  *     tags: [Personal]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID del personal
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               archivos:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                   format: binary
//  *     responses:
//  *       201:
//  *         description: Archivos agregados
//  *       400:
//  *         description: Límite de archivos excedido
//  *       404:
//  *         description: Personal no encontrado
//  *       500:
//  *         description: Error del servidor
//  */
// router.post(
//     '/:id/archivos',
//     // authMiddleware,
//     upload.array('archivos', 3),
//     personalController.agregarArchivos
// );

// /**
//  * @swagger
//  * /api/personal/{id}/archivos/{archivoId}:
//  *   delete:
//  *     summary: Elimina un archivo específico
//  *     tags: [Personal]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID del personal
//  *       - in: path
//  *         name: archivoId
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID del archivo a eliminar
//  *     responses:
//  *       200:
//  *         description: Archivo eliminado
//  *       404:
//  *         description: Personal o archivo no encontrado
//  *       500:
//  *         description: Error del servidor
//  */
// router.delete(
//     '/:id/archivos/:archivoId',
//     // authMiddleware,
//     personalController.eliminarArchivo
// );

module.exports = router;