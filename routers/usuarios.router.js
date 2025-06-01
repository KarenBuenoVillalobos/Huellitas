// Código cortesía del repositorio de Leonel Girett 

/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();


/// MULTER ///
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'uploads/usuario'); // esta carpeta debe existir en el proyecto (raiz)
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname)); // segundos desde 1970
    },
});

// const upload = multer({storage:"storage"}); // si son iguales simplemente lo puedo escribir como
// const upload = multer({storage});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log(file);
        const fileTypes = /jpg|jpeg|png|webp/;
        const mimetype = fileTypes.test(file.mimetype); //deja ver el tipo de imagen
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if(mimetype && path.extname) {
            return cb(null, true);
        };
        cb("Tipo de archivo no soportado");
    },
    limits: {fileSize: 1024 * 1024 * 1}, // aprox 1Mb
});

const controller = require("../controllers/usuarios.controller");

//// METODO GET  /////

// Obtener todas las localidades
router.get('/localidades', controller.getLocalidades); 

// Obtener todos los generos
router.get('/generos', controller.getGeneros);

// Obtener todos los roles
router.get('/roles', controller.getRoles);

// Para todos los productos
router.get('/usuario', controller.allUsuario);

// Para un producto
router.get('/:id_usuario', controller.showUsuario);

//// METODO POST ////
router.post('/', upload.single('foto_usuario'), controller.createUsuario);


//// METODO PUT  ////
router.put('/:id_usuario', upload.single('foto_usuario'), controller.updateUsuario); //upload.single('imagen')

//// METODO DELETE ////
router.delete('/:id_usuario', controller.deleteUsuario);

// EXPORTAR ROUTERS
module.exports = router;