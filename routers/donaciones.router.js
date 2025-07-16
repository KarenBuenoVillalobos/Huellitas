/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/donaciones.controller");

//// METODO GET  /////
// Ruta para obtener los articulos
router.get('/articulos', controller.getArticulos);

// Para todos las donaciones
router.get('/', controller.allDonacion);

//Para donaciones pendientes
router.get('/pendientes', controller.getDonacionesPendientes);

// Para una donación
router.get('/:id_donacion', controller.showDonacion);
router.get('/nombre/:nombre_donador', controller.showDonadorName);


router.post('/solicitud', controller.insertDonacionPendiente);

//// METODO POST  ////
router.post('/', controller.insertDonacion);

//// METODO PUT  ////
router.put('/:id_donacion', controller.updateDonacion);

router.put('/:id_donacion/estado', controller.actualizarEstadoDonacion);

//// METODO DELETE ////
router.delete('/:id_donacion', controller.deleteDonacion);

// EXPORTAR ROUTERS
module.exports = router;