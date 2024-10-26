// Archivo de entrada (enterpoint)

require("dotenv").config();

const express = require("express");
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
app.use("/auth", authRouter);

const usuariosRouter = require('./routers/usuarios.router');
app.use('/login', usuariosRouter);

app.get("/", (req, res) => {
    res.end("Hola Huellitas");
});
// Esta es la ruta principal del proyecto "/"

// const PORT = 3000;
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
