/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/adopciones.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allAdopcion);

// Para un producto
router.get('/:id_adopcion', controller.showAdopcion);

//// METODO POST  ////
router.post('/', controller.insertAdopcion);

//// METODO PUT  ////
router.put('/:id_adopcion', controller.updateAdopcion);

//// METODO DELETE ////
router.delete('/:id_adopcion', controller.deleteAdopcion);

// EXPORTAR ROUTERS
module.exports = router;