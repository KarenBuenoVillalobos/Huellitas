/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();
const multer = require("multer"); //preguntar si es necesario
const upload = multer();          //preguntar si es necesario

const controller = require("../controllers/articulos.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allArticulo);

// Para un producto
router.get('/:id_articulo', controller.showArticulo);
router.get('/nombre/:nombre_articulo', controller.showArticuloName);

//// METODO POST  ////
// router.post('/', controller.insertArticulo);
router.post("/", upload.none(), controller.insertArticulo); //preguntar si es necesario

//// METODO PUT  ////
router.put('/:id_articulo', upload.none(), controller.updateArticulo); //preguntar si es necesario

//// METODO DELETE ////
router.delete('/:id_articulo', controller.deleteArticulo);

// EXPORTAR ROUTERS
module.exports = router;