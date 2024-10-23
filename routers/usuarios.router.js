// Código cortesía del repositorio de Leonel Girett 

/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/usuarios.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allUsuario);

// Para un producto
router.get('/:id_usuario', controller.showUsuario);


//// METODO PUT  ////
router.put('/:id_usuario', controller.updateUsuario);

//// METODO DELETE ////
router.delete('/:id_usuario', controller.deleteUsuario);

// EXPORTAR ROUTERS
module.exports = router;