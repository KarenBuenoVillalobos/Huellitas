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

// Para todos las adopciones
const allAdopcion = (req, res) => {
    const sql = "SELECT * FROM adopciones";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        res.json(rows);
    }); 
};

// Para una adopcion
const showAdopcion = (req, res) => {
    const {id_adopcion} = req.params;
    const sql = `
         SELECT 
            adopciones.id_adopcion,
            usuarios.nombre_apellido AS nombre_usuario,
            animales.nombre_animal AS nombre_animal,
            adopciones.telefono,
            adopciones.direccion,
            adopciones.fecha_adopcion
        FROM adopciones
        INNER JOIN usuarios ON adopciones.id_usuario = usuarios.id_usuario
        INNER JOIN animales ON adopciones.id_animal = animales.id_animal
        WHERE adopciones.id_adopcion = ?
    `;
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
    const {id_usuario, id_animal, telefono, direccion, fecha_adopcion} = req.body;
    const sql = "INSERT INTO adopciones (id_usuario, id_animal, telefono, direccion, fecha_adopcion) VALUES (?,?,?,?,?)";
    db.query(sql,[id_usuario, id_animal, telefono, direccion, fecha_adopcion], (error, result) => {
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
    const {nombre_usuario, nombre_animal, telefono, direccion, fecha_adopcion} = req.body;
    const sql = `
    UPDATE adopciones
    INNER JOIN usuarios ON adopciones.id_usuario = usuarios.id_usuario
    INNER JOIN animales ON adopciones.id_animal = animales.id_animal
    SET 
        usuarios.nombre_apellido = ?,
        animales.nombre_animal = ?,
        adopciones.telefono = ?,
        adopciones.direccion = ?,
        adopciones.fecha_adopcion = ?
    WHERE adopciones.id_adopcion = ?
`;
    db.query(sql,[nombre_usuario, nombre_animal, telefono, direccion, fecha_adopcion, id_adopcion], (error, result) => {
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
        res.json({mensaje : "Adopcion Borrada"});
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
