// Archivo de entrada (enterpoint)

require("dotenv").config();
// console.log("SECRET_KEY:", process.env.SECRET_KEY);
// console.log("JWT_SECRET:", process.env.JWT_SECRET);
// console.log("JWT_EXPIRATION:", process.env.JWT_EXPIRATION);

const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
//en el cuerpo de la peticion viene un json, lo transformo en un obj JS y
//de esta manera lo puedo utilizar

const adopcionesRouter = require('./routers/adopciones.router');
app.use('/adopciones', adopcionesRouter);

const animalesRouter = require('./routers/animales.router');
app.use('/animales', animalesRouter);
// Siempre que me refiera a animales le coloco el prefijo

const articulosRouter = require('./routers/articulos.router');
app.use('/articulos', articulosRouter);

const donacionesRouter = require('./routers/donaciones.router');
app.use('/donaciones', donacionesRouter);

const voluntariosRouter = require('./routers/voluntarios.router');
app.use('/voluntarios', voluntariosRouter);

//Router de Registro
const authRouter = require("./routers/auth.router");
app.use("/auth", authRouter);  // /registro

const usuariosRouter = require('./routers/usuarios.router');
app.use('/login', usuariosRouter);



// Servir archivos estáticos desde la carpeta PAGES
app.use(express.static(path.resolve(__dirname )));

// Ruta principal del proyecto
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname,'pages',  'index.html'));
});

// Definir otras rutas para tus archivos HTML
app.get("/nosotros", (req, res) => {
    res.sendFile(path.resolve(__dirname,'pages', 'nosotros.html'));
});

app.get("/adopta", (req, res) => {
    res.sendFile(path.resolve(__dirname,'pages', 'adopta.html'));
});

app.get("/contacto", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages', 'contacto.html'));
});

app.get("/donar", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages', 'donar.html'));
});

app.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages', 'login.html'));
});
app.get("/admin", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages', 'admin.html'));
});

// Ruta comodín para servir cualquier archivo HTML desde la carpeta PAGES
app.get('/*', (req, res) => {
    const filePath = path.resolve(__dirname, 'pages', req.params[0] + '.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Página no encontrada');
        }
    });
});

// const PORT = 3000;
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
