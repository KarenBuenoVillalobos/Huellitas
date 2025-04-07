const express = require('express');
const router = express.Router();

const controller = require("../controllers/especies.controller");

// Ruta para registrar una especie
router.post('/', controller.insertEspecie);

module.exports = router;