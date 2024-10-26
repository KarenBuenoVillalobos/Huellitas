/// CONTROLADORES DEL MODULO ///

// Campos de la tabla ADOPCIONES
// id_adopcion
// id_usuario
// id_animal
// telefono
// direccion
// fecha_adopcion

const db = require("../db/db");

//// METODO GET  /////

// Para todos los animales
const allAdopcion = (req, res) => {
    const sql = "SELECT * FROM adopciones";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        res.json(rows);
    }); 
};

// Para un animal
const showAdopcion = (req, res) => {
    const {id_adopcion} = req.params;
    const sql = "SELECT * FROM adopciones WHERE id_animal = ?";
    db.query(sql,[id_adopcion], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la adopción buscada."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const insertAdopcion = (req, res) => {
    const {telefono, direccion, fecha_adopcion} = req.body;
    const sql = "INSERT INTO adopciones (telefono, direccion, fecha_adopcion) VALUES (?,?,?)";
    db.query(sql,[telefono, direccion, fecha_adopcion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        const adopcion = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(adopcion); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateAdopcion = (req, res) => {
    const {id_adopcion} = req.params;
    const {telefono, direccion, fecha_adopcion} = req.body;
    const sql ="UPDATE adopciones SET telefono = ?, direccion = ?, fecha_adopcion = ? WHERE id_adopcion = ?";
    db.query(sql,[telefono, direccion, fecha_adopcion, id_adopcion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La adopción a modificar no existe."});
        };
        
        const adopcion = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(adopcion); // mostrar el elmento que existe
    });     
};


//// METODO DELETE ////
const deleteAdopcion = (req, res) => {
    const {id_adopcion} = req.params;
    const sql = "DELETE FROM adopciones WHERE id_adopcion = ?";
    db.query(sql,[id_adopcion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La adopción a borrar no existe."});
        };
        res.json({mesaje : "Adopcion Borrada"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allAdopcion,
    showAdopcion,
    insertAdopcion,
    updateAdopcion,
    deleteAdopcion
};
