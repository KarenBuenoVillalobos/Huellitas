/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const multer = require("multer"); //preguntar si es necesario
const upload = multer();          //preguntar si es necesario

const controller = require("../controllers/adopciones.controller");

//// METODO GET  /////
// Ruta para obtener los animales
router.get('/animales', controller.getAnimales);

// Para todos los productos
router.get('/', controller.allAdopcion);

// Para un producto
router.get('/:id_adopcion', controller.showAdopcion);
router.get('/nombre/:nombre_apellido', controller.showAdoptanteName);

//// METODO POST  ////
router.post('/', upload.none(), controller.insertAdopcion);

//// METODO PUT  ////
router.put('/:id_adopcion', upload.none(), controller.updateAdopcion);

//// METODO DELETE ////
router.delete('/:id_adopcion', controller.deleteAdopcion);

// EXPORTAR ROUTERS
module.exports = router;