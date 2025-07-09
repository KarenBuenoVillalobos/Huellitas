const mysql = require("mysql2");
require("dotenv").config();

// Crear un pool de conexiones
const pool = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar si la conexión inicial es exitosa
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
    } else {
        console.log("Conectado a la base de datos - Huellitas");
        connection.release(); // Liberar la conexión de prueba
    }
});

// Exportar el pool para usar en otros archivos
module.exports = pool;