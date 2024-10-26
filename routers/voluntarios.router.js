/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/voluntarios.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allVoluntario);

// Para un producto
router.get('/:id_voluntario', controller.showVoluntario);

//// METODO POST  ////
router.post('/', controller.insertVoluntario);

//// METODO PUT  ////
router.put('/:id_voluntario', controller.updateVoluntario);

//// METODO DELETE ////
router.delete('/:id_voluntario', controller.deleteVoluntario);

// EXPORTAR ROUTERS
module.exports = router;