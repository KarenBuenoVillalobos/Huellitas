/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/donaciones.controller");

//// METODO GET  /////
// Ruta para obtener los articulos
router.get('/articulos', controller.getArticulos);

// Para todos las donaciones
router.get('/', controller.allDonacion);

// Para un producto
router.get('/:id_donacion', controller.showDonacion);
router.get('/nombre/:nombre_donador', controller.showDonadorName);

//// METODO POST  ////
router.post('/', controller.insertDonacion);

//// METODO PUT  ////
router.put('/:id_donacion', controller.updateDonacion);

//// METODO DELETE ////
router.delete('/:id_donacion', controller.deleteDonacion);

// EXPORTAR ROUTERS
module.exports = router;