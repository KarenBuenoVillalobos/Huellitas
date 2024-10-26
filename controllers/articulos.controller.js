/// CONTROLADORES DEL MODULO ///

// Campos de la tabla ARTICULOS
// id_articulo
// nombre_articulo

const db = require("../db/db");

//// METODO GET  /////

// Para todos los animales
const allArticulo = (req, res) => {
    const sql = "SELECT * FROM articulos";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        res.json(rows);
    }); 
};

// Para un animal
const showArticulo = (req, res) => {
    const {id_articulo} = req.params;
    const sql = "SELECT * FROM articulos WHERE id_articulo = ?";
    db.query(sql,[id_articulo], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el artículo buscado."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const insertArticulo = (req, res) => {
    const {nombre_articulo} = req.body;
    const sql = "INSERT INTO articulos (nombre_articulo) VALUES (?)";
    db.query(sql,[nombre_articulo], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        const articulo = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(articulo); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateArticulo = (req, res) => {
    const {id_articulo} = req.params;
    const {nombre_articulo} = req.body;
    const sql ="UPDATE articulos SET nombre_articulo = ? WHERE id_articulo = ?";
    db.query(sql,[nombre_articulo, id_articulo], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El artículo a modificar no existe."});
        };
        
        const articulo = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(articulo); // mostrar el elmento que existe
    });     
};


//// METODO DELETE ////
const deleteArticulo = (req, res) => {
    const {id_articulo} = req.params;
    const sql = "DELETE FROM articulos WHERE id_articulo = ?";
    db.query(sql,[id_articulo], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El artículo a borrar no existe."});
        };
        res.json({mesaje : "Artículo Borrado"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allArticulo,
    showArticulo,
    insertArticulo,
    updateArticulo,
    deleteArticulo
};
