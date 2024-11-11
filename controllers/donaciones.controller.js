/// CONTROLADORES DEL MODULO ///

// Campos de la tabla DONACIONES
// id_donacion
// id_usuario
// id_articulo
// fecha_donacion

const db = require("../db/db");

//// METODO GET  /////

// Para todos las donaciones
const allDonacion = (req, res) => {
    const sql = "SELECT * FROM donaciones";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        res.json(rows);
    }); 
};

// Para una donación
const showDonacion = (req, res) => {
    const {id_donacion} = req.params;
    const sql = "SELECT * FROM donaciones WHERE id_donacion = ?";
    db.query(sql,[id_donacion], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la donación buscada."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const insertDonacion = (req, res) => {
    const {id_usuario, id_articulo, fecha_donacion} = req.body;
    const sql = "INSERT INTO donaciones (id_usuario, id_articulo, fecha_donacion) VALUES (?,?,?)";
    db.query(sql,[id_usuario, id_articulo, fecha_donacion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        const donacion = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(donacion); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateDonacion = (req, res) => {
    const {id_donacion} = req.params;
    const {id_usuario, id_articulo, fecha_donacion} = req.body;
    const sql ="UPDATE donaciones SET id_usuario = ?, id_articulo = ?, fecha_donacion = ? WHERE id_donacion = ?";
    db.query(sql,[id_usuario, id_articulo, fecha_donacion, id_donacion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La donación a modificar no existe."});
        };
        
        const donacion = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(donacion); // mostrar el elmento que existe
    });     
};


//// METODO DELETE ////
const deleteDonacion = (req, res) => {
    const {id_donacion} = req.params;
    const sql = "DELETE FROM donaciones WHERE id_donacion = ?";
    db.query(sql,[id_donacion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La donación a borrar no existe."});
        };
        res.json({mensaje : "Donación Borrada"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allDonacion,
    showDonacion,
    insertDonacion,
    updateDonacion,
    deleteDonacion
};
