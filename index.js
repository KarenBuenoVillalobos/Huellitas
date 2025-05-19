// Archivo de entrada (enterpoint)

require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());


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

//const especiesRouter = require('./routers/especies.router');
//app.use('/especies', especiesRouter);


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

app.get("/loginsesion", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages', 'login.html'));
});
app.get("/admin", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages','admin', 'listas.html'));
});

/*app.get("/especie",(req,res) => {
    res.sendFile(path.resolve(__dirname, 'pages', 'especies.html'));
});
*/

app.get("/formulario-animales",(req,res) => {
    res.sendFile(path.resolve(__dirname, 'pages', 'animales.html'));
});

app.get("/formulario-articulos",(req,res) => {
    res.sendFile(path.resolve(__dirname, 'pages', 'articulos.html'));
});

app.get("/formulario-voluntarios",(req,res) => {
    res.sendFile(path.resolve(__dirname, 'pages', 'voluntarios.html'));
});

// Ruta comodín para servir cualquier archivo HTML desde la carpeta PAGES
app.get('/:page', (req, res) => {
    const filePath = path.resolve(__dirname, 'pages', req.params.page + '.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Página no encontrada');
        }
    });
});

// const PORT = 3000;
//prueb
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
