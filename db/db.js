const mysql = require("mysql2");
require("dotenv").config();

//// CONEXION A LA BBDD ////
const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

connection.connect((error) => {
    if(error){
        return console.error(error);
    }
    console.log("Estamos conectados a la Base de Datos - Huellitas");
});

// EXPORTAR DEL MODULO LA FUNCION CONNECTION
module.exports = connection;