// const express = require('express');
// const router = express.Router();

const router = require("express").Router();
const subirArchivoController = require('../controllers/subirArchivoController');

router.post('/upload', subirArchivoController.uploadFile);
router.get('/files', subirArchivoController.getFiles);
router.delete('/files/:id', subirArchivoController.deleteFile);

module.exports = router;