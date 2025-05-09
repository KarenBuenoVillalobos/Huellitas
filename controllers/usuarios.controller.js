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

//// METODO GET  /////

const allUsuario = (req, res) => {
    const sql = "SELECT * FROM usuarios";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        res.json(rows);
    }); 
};

const showUsuario = (req, res) => {
    const {id_usuario} = req.params;
    const sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
    db.query(sql,[id_usuario], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el usuario buscado."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO PUT  ////
const updateUsuario = (req, res) => {
    console.log(req.file);
    let imageName = "";

    if(req.file){
        imageName = req.file.filename;
    };

    const {id_usuario} = req.params;
    const {nombre_apellido, email, localidad, genero, password} = req.body;
    const sql ="UPDATE usuarios SET nombre_apellido = ?, email = ?, localidad = ?, genero = ?, password = ?, foto_usuario = ? WHERE id_usuario = ?";
    db.query(sql,[nombre_apellido, email, localidad, genero, password, imageName, id_usuario], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El usuario a modificar no existe."});
        };
        
        const login = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(login); // mostrar el elemento que existe
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
    allUsuario,
    showUsuario,
    updateUsuario,
    deleteUsuario
};