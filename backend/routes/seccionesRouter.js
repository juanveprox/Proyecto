const router = require("express").Router();
const seccionesController = require("../controllers/seccionesController")


// Crear un nuevo grado
router.post('/', seccionesController.crearSeccion);

// Obtener todos los grados con información del profesor
router.get('/', seccionesController.obtenerSeccionConInfoProfesor);

// Asignar profesor a un grado
router.put('/:id/asignar-profesor', seccionesController.asignarProfeSeccion);

// Obtener profesores disponibles (tipo "docente")
router.get('/profesores', seccionesController.profesoresDiponibles);

// Agregar estudiante a un grado
router.post('/:id/estudiantes', seccionesController.agregarEstudianteSeccion);

// Obtener estudiantes de un grado
router.get('/:id/estudiantes', seccionesController.obtenerEstudianteGrado);

// Obtener estudiantes no asignados a ningún grado
router.get('/estudiantes/disponibles', seccionesController.estudiantesNoAsignados);

// Eliminar estudiante de un grado
router.delete('/:idGrado/estudiantes/:idEstudiante', seccionesController.eliminarEstudiante);

// Obtener detalles completos de un grado
router.get('/:id/detalles', seccionesController.obtenerInfoCompletaGrado);

// Eliminar un grado y sus relaciones
router.delete('/:id', seccionesController.eliminarSeccion);


module.exports = router;