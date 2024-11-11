// Archivo de entrada (enterpoint)

require("dotenv").config();
// console.log("SECRET_KEY:", process.env.SECRET_KEY);
// console.log("JWT_SECRET:", process.env.JWT_SECRET);
// console.log("JWT_EXPIRATION:", process.env.JWT_EXPIRATION);

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
app.use("/auth", authRouter);  // /registro

const usuariosRouter = require('./routers/usuarios.router');
app.use('/login', usuariosRouter);

app.get("/", (req, res) => {
    res.end("Hola Huellitas!");
});
// Esta es la ruta principal del proyecto "/"

// // Autenticacion
// import {methods as authentication} from "./controllers/auth.controller.js";

// // Autorizacion
// import {methods as authorization} from "./middleware/authorization.js";

// // Rutas
// app.get("/", authorization.soloPublico, (req,res) => res.sendFile(__dirname + "/login.html"));
// app.get("/registro", authorization.soloPublico, (req,res) => res.sendFile(__dirname + "/register.html"));
// app.get("/admin", authorization.soloAdmin, (req,res) => res.sendFile(__dirname + "/admin/admin.html"));
// app.post("/api/login",authentication.login);
// app.post("/api/register",authentication.register);

// const PORT = 3000;
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
