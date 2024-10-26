/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/donaciones.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allDonacion);

// Para un producto
router.get('/:id_donacion', controller.showDonacion);

//// METODO POST  ////
router.post('/', controller.insertDonacion);

//// METODO PUT  ////
router.put('/:id_donacion', controller.updateDonacion);

//// METODO DELETE ////
router.delete('/:id_donacion', controller.deleteDonacion);

// EXPORTAR ROUTERS
module.exports = router;