/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/adoptantes.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allAdoptante);

// Para un producto
router.get('/:id_adoptante', controller.showAdoptante);

//// METODO POST  ////
router.post('/', controller.insertAdoptante);

//// METODO PUT  ////
router.put('/:id_adoptante', controller.updateAdoptante);

//// METODO DELETE ////
router.delete('/:id_adoptante', controller.deleteAdoptante);

// EXPORTAR ROUTERS
module.exports = router;