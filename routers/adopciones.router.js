/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/adopciones.controller");

//// METODO GET  /////
// Ruta para obtener los animales
router.get('/animales', controller.getAnimales);

// Para todos las adopciones
router.get('/', controller.allAdopcion);

// Para una adopcion
router.get('/:id_adopcion', controller.showAdopcion);
router.get('/nombre/:nombre_apellido', controller.showAdoptanteName);
router.get('/animal/:nombre_animal', controller.showAnimalName);
// router.get('/animales-disponibles', controller.getAnimalesDisponibles);

//// METODO POST  ////
router.post('/', controller.insertAdopcion);

// Ruta para insertar una adopción desde el formulario
router.post('/form-adopcion', controller.insertAdopcionForm);

//// METODO PUT  ////
router.put('/:id_adopcion', controller.updateAdopcion);

//// METODO DELETE ////
router.delete('/:id_adopcion', controller.deleteAdopcion);

// EXPORTAR ROUTERS
module.exports = router;