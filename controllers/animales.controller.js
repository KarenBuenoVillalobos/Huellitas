/// CONTROLADORES DEL MODULO ///

// Campos de la tabla animales
// id_animal
// nombre
// especie
// edad
// descripcion
// fecha_adopcion

const db = require("../db/db");

//// METODO GET  /////

// Para todos los animales
const allAnimal = (req, res) => {
    const sql = "SELECT * FROM animales";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        res.json(rows);
    }); 
};

// Para un animal
const showAnimal = (req, res) => {
    const {id_animal} = req.params;
    const sql = "SELECT * FROM animales WHERE id_animal = ?";
    db.query(sql,[id_animal], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el animal buscado."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const insertAnimal = (req, res) => {   //storeMovie
    console.log(req.file);
    let imageName = "";

    if(req.file){
        imageName = req.file.filename;
    };

    const {nombre_animal, especie, edad, descripcion} = req.body;

    const sql = "INSERT INTO animales (nombre_animal, especie, edad, descripcion, imagen) VALUES (?,?,?,?,?)";

    db.query(sql,[nombre_animal, especie, edad, descripcion, imageName], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        const animal = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(animal); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateAnimal = (req, res) => {
    // console.log(req.file);
    // let imageName = "";

    // if(req.file){
    //     imageName = req.file.filename;
    // };

    const {id_animal} = req.params;
    const {nombre_animal, especie, edad, descripcion} = req.body;
    const sql ="UPDATE animales SET nombre_animal = ?, especie = ?, edad = ?, descripcion = ? WHERE id_animal = ?";
    db.query(sql,[nombre_animal, especie, edad, descripcion, id_animal], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El animal a modificar no existe."});
        };
        
        const animal = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(animal); // mostrar el elmento que existe
    });     
};


//// METODO DELETE ////
const deleteAnimal = (req, res) => {
    const {id_animal} = req.params;
    const sql = "DELETE FROM animales WHERE id_animal = ?";
    db.query(sql,[id_animal], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El animal a borrar no existe."});
        };
        res.json({mesaje : "Animal Borrado"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allAnimal,
    showAnimal,
    insertAnimal,
    updateAnimal,
    deleteAnimal
};
