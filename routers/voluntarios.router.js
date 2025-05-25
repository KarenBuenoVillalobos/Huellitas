/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

//// MULTER ////
const multer = require("multer"); //preguntar si es necesario
const upload = multer();          //preguntar si es necesario

const controller = require("../controllers/voluntarios.controller");

//// METODO GET  /////
// Ruta para obtener las asignaciones
router.get('/asignaciones', controller.getAsignaciones);

// Para todos los productos
router.get('/', controller.allVoluntario);

// Para un producto
router.get('/:id_voluntario', controller.showVoluntario);
router.get('/nombre/:nombre_voluntario', controller.showVoluntarioEmail);

//// METODO POST  ////
router.post('/', upload.none(), controller.insertVoluntario);

//// METODO PUT  ////
router.put('/:id_voluntario', upload.none(), controller.updateVoluntario);

//// METODO DELETE ////
router.delete('/:id_voluntario', controller.deleteVoluntario);

// EXPORTAR ROUTERS
module.exports = router;