/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/articulos.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allArticulo);

// Para un producto
router.get('/:id_articulo', controller.showArticulo);

//// METODO POST  ////
router.post('/', controller.insertArticulo);

//// METODO PUT  ////
router.put('/:id_articulo', controller.updateArticulo);

//// METODO DELETE ////
router.delete('/:id_articulo', controller.deleteArticulo);

// EXPORTAR ROUTERS
module.exports = router;