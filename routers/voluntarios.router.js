/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/voluntarios.controller");


//// METODO GET  /////
// Ruta para obtener las asignaciones
router.get('/asignaciones', controller.getAsignaciones);

// Para todos los productos
router.get('/', controller.allVoluntario);

// Para un producto
router.get('/:id_voluntario', controller.showVoluntario);
// router.get('/nombre/:nombre_voluntario', controller.showVoluntarioEmail);
// router.get('/email/:email', controller.showVoluntarioEmail);
router.get('/asignacion/:asignacion', controller.showVoluntarioAsignacion);

//// METODO POST  ////
router.post('/', controller.insertVoluntario);

//// METODO PUT  ////
router.put('/:id_voluntario', controller.updateVoluntario);

//// METODO DELETE ////
router.delete('/:id_voluntario', controller.deleteVoluntario);

// EXPORTAR ROUTERS
module.exports = router;