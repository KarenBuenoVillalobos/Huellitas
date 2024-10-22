/// CONTROLADORES DEL MODULO ///

// Campos de la tabla ADOPTANTES
// id_adoptante
// nombre
// apellido
// email
// telefono
// direccion
// fecha_adopcion

const db = require("../db/db");

//// METODO GET  /////

// Para todos los animales
const allAdoptante = (req, res) => {
    const sql = "SELECT * FROM adoptantes";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        res.json(rows);
    }); 
};

// Para un animal
const showAdoptante = (req, res) => {
    const {id_adoptante} = req.params;
    const sql = "SELECT * FROM adoptantes WHERE id_adoptante = ?";
    db.query(sql,[id_adoptante], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el adoptante buscado."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const insertAdoptante = (req, res) => {   //storeMovie
    const {nombre, apellido, email, telefono, direccion, fecha_adopcion} = req.body;
    const sql = "INSERT INTO adoptantes (nombre, apellido, email, telefono, direccion, fecha_adopcion) VALUES (?,?,?,?,?,?)";
    db.query(sql,[nombre, apellido, email, telefono, direccion, fecha_adopcion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        const adoptante = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(adoptante); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateAdoptante = (req, res) => {
    const {id_adoptante} = req.params;
    const {nombre, apellido, email, telefono, direccion, fecha_adopcion} = req.body;
    const sql ="UPDATE adoptantes SET nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ?, fecha_adopcion = ? WHERE id_adoptante = ?";
    db.query(sql,[nombre, apellido, email, telefono, direccion, fecha_adopcion, id_adoptante], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El adoptante a modificar no existe."});
        };
        
        const adoptante = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(adoptante); // mostrar el elmento que existe
    });     
};


//// METODO DELETE ////
const deleteAdoptante = (req, res) => {
    const {id_adoptante} = req.params;
    const sql = "DELETE FROM adoptantes WHERE id_adoptante = ?";
    db.query(sql,[id_adoptante], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El adoptante a borrar no existe."});
        };
        res.json({mesaje : "Adoptante Borrado"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allAdoptante,
    showAdoptante,
    insertAdoptante,
    updateAdoptante,
    deleteAdoptante
};
