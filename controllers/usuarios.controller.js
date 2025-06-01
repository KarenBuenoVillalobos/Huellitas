// Código cortesía del repositorio de Leonel Girett 

/// CONTROLADORES DEL MODULO ///

// Campos de la tabla USUARIOS
// id_adopcion
// nombre_apellido
// email
// sexo
// localidad
// password
// imagen

const db = require("../db/db");
const bcrypt = require('bcryptjs');


// Obtener todas las localidades
const getLocalidades = (req, res) => {
    const sql = `SELECT id_localidad, descripcion FROM localidades`;
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudieron obtener las localidades." });
        }
        res.json(rows);
    });
};

// Obtener todos los generos
const getGeneros = (req, res) => {
    const sql = `SELECT id_genero, descripcion FROM genero`;
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudieron obtener los géneros." });
        }
        res.json(rows);
    });
};
// Obtener todos los roles
const getRoles = (req, res) => {
    const sql = `SELECT id_rol, descripcion FROM roles`;
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudieron obtener los roles." });
        }
        res.json(rows);
    });
}

//// METODO GET  /////

const allUsuario = (req, res) => {
    const sql = `
        SELECT 
            usuarios.id_usuario,
            usuarios.nombre_apellido,
            usuarios.email,
            usuarios.password,
            usuarios.foto_usuario,
            localidades.descripcion AS localidad,
            genero.descripcion AS genero,
            roles.descripcion AS rol
        FROM usuarios
        LEFT JOIN localidades ON usuarios.id_localidad = localidades.id_localidad
        LEFT JOIN genero ON usuarios.id_genero = genero.id_genero
        LEFT JOIN roles ON usuarios.id_rol = roles.id_rol
    `;
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

const showUsuario = (req, res) => {
    const { id_usuario } = req.params;
    const sql = `
        SELECT 
            usuarios.id_usuario,
            usuarios.nombre_apellido,
            usuarios.email,
            usuarios.password,
            usuarios.foto_usuario,
            localidades.descripcion AS localidad,
            genero.descripcion AS genero,
            roles.descripcion AS rol
        FROM usuarios
        LEFT JOIN localidades ON usuarios.id_localidad = localidades.id_localidad
        LEFT JOIN genero ON usuarios.id_genero = genero.id_genero
        LEFT JOIN roles ON usuarios.id_rol = roles.id_rol
        WHERE usuarios.id_usuario = ?
    `;
    db.query(sql, [id_usuario], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: "ERROR: No existe el usuario buscado." });
        }
        res.json(rows[0]); // Devuelve el usuario encontrado
    });
};

//// METODO POST ////
const createUsuario = (req, res) => {
    let imageName = "";

    if (req.file) {
        imageName = req.file.filename;
    }

    const { nombre_apellido, email, id_localidad, id_genero, password, id_rol } = req.body;

    if (!nombre_apellido || !email || !id_localidad || !id_genero || !password || !id_rol) {
        return res.status(400).json({ error: "ERROR: Todos los campos son obligatorios." });
    }

    // Encriptar la contraseña igual que en register (salt de 8)
    bcrypt.hash(password, 8, (err, hash) => {
        if (err) {
            console.error("Error al encriptar la contraseña:", err);
            return res.status(500).json({ error: "ERROR: No se pudo encriptar la contraseña." });
        }

        const sql = `
            INSERT INTO usuarios (nombre_apellido, email, id_localidad, id_genero, password, foto_usuario, id_rol)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [nombre_apellido, email, id_localidad, id_genero, hash, imageName, id_rol], (error, result) => {
            if (error) {
                console.error("Error en la consulta SQL:", error);
                return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
            }
            const login = { ...req.body, foto_usuario: imageName };
            res.status(201).json(login);
        });
    });
};

//// METODO PUT  ////
const updateUsuario = (req, res) => {
    console.log(req.file);
    let imageName = "";

    if (req.file) {
        imageName = req.file.filename;
    }

    const { id_usuario } = req.params;
    const { nombre_apellido, email, id_localidad, id_genero, password, id_rol } = req.body;

    if (!nombre_apellido || !email || !id_localidad || !id_genero || !password || !id_rol) {
        return res.status(400).json({ error: "ERROR: Todos los campos son obligatorios." });
    }

    const sql = `
        UPDATE usuarios 
        SET 
            nombre_apellido = ?, 
            email = ?, 
            id_localidad = ?, 
            id_genero = ?, 
            password = ?, 
            foto_usuario = ?, 
            id_rol = ? 
        WHERE id_usuario = ?
    `;

    db.query(sql, [nombre_apellido, email, id_localidad, id_genero, password, imageName, id_rol, id_usuario], (error, result) => {
        if (error) {
            console.error("Error en la consulta SQL:", error);
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (result.affectedRows == 0) {
            return res.status(404).send({ error: "ERROR: El usuario a modificar no existe." });
        }

        const login = { ...req.body, ...req.params, foto_usuario: imageName };
        res.json(login);
    });
};


//// METODO DELETE ////
const deleteUsuario = (req, res) => {
    const {id_usuario} = req.params;
    const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
    db.query(sql,[id_usuario], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El usuario a borrar no existe."});
        };
        res.json({mensaje : "Usuario Eliminado"});
    }); 
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    getLocalidades,
    getGeneros,
    getRoles,
    allUsuario,
    showUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario
};