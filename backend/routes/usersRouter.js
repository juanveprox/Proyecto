
const router = require("express").Router();
// import { authenticate, isAdmin } from '../middlewares/auth.js';
const usersController = require("../controllers/usersController")
const autenticarMiddleware = require("../middlewares/autenticarMiddleware")


// Rutas protegidas para administradores
router.get('/', usersController.getUsers);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

//Rutas para usuarios
// router.put('/:id/user', authenticate, updateUserData);

router.put('/:id/user', autenticarMiddleware.authenticate, usersController.updateUserData);
router.put('/:id/password', autenticarMiddleware.authenticate, usersController.updatePassword);


module.exports = router;