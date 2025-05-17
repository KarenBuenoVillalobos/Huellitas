/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

/// MULTER ///
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

//// AUTH ////
const controller = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

//Localidades
router.get('/localidades', controller.localidades);

//// METODO POST  ////
router.post('/registro',upload.single('foto_usuario'), controller.register); //upload.single('imagen')
router.post('/login', controller.login);

router.get("/protected", authMiddleware, (req, res) => {
    res.status(200).send(`Hola Usuario ${req.userId}`);
});

// EXPORTAR ROUTERS
module.exports = router;