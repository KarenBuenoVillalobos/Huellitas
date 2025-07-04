/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

//// MULTER ////
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'uploads'); // esta carpeta debe existir en el proyecto (raiz)
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

const controller = require("../controllers/animales.controller");


//// METODO GET  /////
// Ruta para obtener las especies
router.get('/especies', controller.getEspecies);

//// METODO POST  ////
router.post('/', upload.single('foto_animal'), controller.insertAnimal); //upload.single('imagen')

// Para todos los animales
router.get('/', controller.allAnimal);

router.get('/:id_animal', controller.showAnimal);
router.get('/nombre/:nombre_animal', controller.showAnimalName);

//// METODO PUT  ////
router.put('/:id_animal', upload.single('foto_animal'), controller.updateAnimal);

//// METODO DELETE ////
router.delete('/:id_animal', controller.deleteAnimal);

// EXPORTAR ROUTERS
module.exports = router;