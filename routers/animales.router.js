/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/animales.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allAnimal);

// Para un producto
router.get('/:id_animal', controller.showAnimal);

//// METODO POST  ////
router.post('/', controller.insertAnimal);

//// METODO PUT  ////
router.put('/:id_animal', controller.updateAnimal);

//// METODO DELETE ////
router.delete('/:id_animal', controller.deleteAnimal);

// EXPORTAR ROUTERS
module.exports = router;