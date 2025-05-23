/// CONTROLADORES DEL MODULO ///

// Campos de la tabla ARTICULOS
// id_articulo
// nombre_articulo

const db = require("../db/db");

//// METODO GET  /////

// Para todos los articulos
const allArticulo = (req, res) => {
    const sql = "SELECT * FROM articulos";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        res.json(rows);
    }); 
};

// Para un articulo
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

const showArticuloName = (req, res) => {
    const { nombre_articulo } = req.params;
    console.log(nombre_articulo);
    const sql = "SELECT * FROM articulos WHERE nombre_articulo LIKE ?";
    db.query(sql, [`%${nombre_articulo}%`], (error, rows) => {
        console.log(rows);
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: "ERROR: No existe el artículo buscado." });
        }
        res.json(rows); // Devuelve todos los resultados
    });
};

//// METODO POST  ////
const insertArticulo = (req, res) => {
    const {nombre_articulo, detalles} = req.body;
    const sql = "INSERT INTO articulos (nombre_articulo, detalles) VALUES (?,?)";

    db.query(sql,[nombre_articulo, detalles], (error, result) => {
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
    const {nombre_articulo, detalles} = req.body;
    const sql ="UPDATE articulos SET nombre_articulo = ?, detalles = ? WHERE id_articulo = ?";
    db.query(sql,[nombre_articulo, detalles, id_articulo], (error, result) => {
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
        res.json({mensaje : "Artículo Borrado"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allArticulo,
    showArticulo,
    showArticuloName,
    insertArticulo,
    updateArticulo,
    deleteArticulo
};
