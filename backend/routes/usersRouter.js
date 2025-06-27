
const router = require("express").Router();
// import { authenticate, isAdmin } from '../middlewares/auth.js';
const usersController = require("../controllers/usersController")


// Rutas protegidas para administradores
router.get('/', usersController.getUsers);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;