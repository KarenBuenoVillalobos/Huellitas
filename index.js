// Archivo de entrada (enterpoint)

const express = require("express");
const app = express();

app.use(express.json());
//en el cuerpo de la peticion viene un json, lo transformo en un obj JS y
//de esta manera lo puedo utilizar

const animalesRouter = require('./routers/animales.router');
app.use('/animales', animalesRouter);
// Siempre que me refiera a animales le coloco el prefijo

const adoptantesRouter = require('./routers/adoptantes.router');
app.use('/adoptantes', adoptantesRouter);

const adopcionesRouter = require('./routers/adopciones.router');
app.use('/adopciones', adopcionesRouter);

app.get("/", (req, res) => {
    res.end("Hola Huellitas");
});
// Esta es la ruta principal del proyecto "/"

const PORT = 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
