/// CONTROLADORES DEL MODULO ///

// Campos de la tabla VOLUNTARIOS
// id_volutario
// asignacion

const db = require("../db/db");
const { get } = require("../routers/voluntarios.router");

//// METODO GET  /////

// Obtener las asignaciones
const getAsignaciones = (req, res) => {
    const sql = `SELECT id_asignacion, nombre_asignacion FROM asignaciones`;
    db.query(sql, (error, rows) => {
        if (error) {
            console.error("Error al obtener las asignaciones:", error);
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

// Para todos los voluntarios
const allVoluntario = (req, res) => {
    const sql = `
        SELECT 
            voluntarios.id_voluntario,
            usuarios.email,
            asignaciones.nombre_asignacion AS asignacion,
            voluntarios.tarea
        FROM voluntarios
        INNER JOIN asignaciones ON voluntarios.id_asignacion = asignaciones.id_asignacion
    `;
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        res.json(rows);
    }); 
};

// Para un voluntario
const showVoluntario = (req, res) => {
    const {id_voluntario} = req.params;
    const sql = `
    SELECT 
        voluntarios.id_voluntario,
        asignaciones.nombre_asignacion AS asignacion,
        voluntarios.tarea
    FROM voluntarios
    INNER JOIN asignaciones ON voluntarios.id_asignacion = asignaciones.id_asignacion
    WHERE voluntarios.id_voluntario = ?
`;
    db.query(sql,[id_voluntario], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el voluntario buscado."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const insertVoluntario = (req, res) => {
    const { id_asignacion, tarea } = req.body;
    const sql = `
        INSERT INTO voluntarios (id_asignacion, tarea) 
        VALUES (?, ?)
    `;
    db.query(sql, [id_asignacion, tarea], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        const voluntario = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(voluntario); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateVoluntario = (req, res) => {
    const { id_voluntario } = req.params;
    const { id_asignacion, tarea } = req.body;
    const sql = `
        UPDATE voluntarios 
        SET 
            id_asignacion = ?, 
            tarea = ? 
        WHERE id_voluntario = ?
    `;
    db.query(sql, [id_asignacion, tarea, id_voluntario], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El voluntario a modificar no existe."});
        };
        
        const voluntario = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(voluntario); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const deleteVoluntario = (req, res) => {
    const {id_voluntario} = req.params;
    const sql = "DELETE FROM voluntarios WHERE id_voluntario = ?";
    db.query(sql,[id_voluntario], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El voluntario a borrar no existe."});
        };
        res.json({mensaje : "Voluntario Borrado"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allVoluntario,
    showVoluntario,
    insertVoluntario,
    updateVoluntario,
    deleteVoluntario,
    getAsignaciones
};
