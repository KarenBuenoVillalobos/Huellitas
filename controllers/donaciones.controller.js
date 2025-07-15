/// CONTROLADORES DEL MODULO ///

// Campos de la tabla DONACIONES
// id_donacion
// id_usuario
// id_articulo
// fecha_donacion
// email
// descripcion

const db = require("../db/db");

// Obtener los articulos
const getArticulos = (req, res) => {
    const sql = `SELECT id_articulo, nombre_articulo FROM articulos`;
    db.query(sql, (error, rows) => {
        if (error) {
            console.error("Error al obtener los articulos:", error);
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

// Para todos las donaciones
const allDonacion = (req, res) => {
    const sql = `
    SELECT 
        donaciones.id_donacion,
        donaciones.nombre_donador AS nombre_donador,
        articulos.nombre_articulo AS nombre_articulo,
        donaciones.email,
        donaciones.descripcion,
        donaciones.fecha_donacion
    FROM donaciones
    INNER JOIN articulos ON donaciones.id_articulo = articulos.id_articulo
`;
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
    const sql = `
        SELECT 
            donaciones.id_donacion,
            donaciones.nombre_donador AS nombre_donador,
            donaciones.id_articulo,
            articulos.nombre_articulo AS nombre_articulo,
            donaciones.email,
            donaciones.descripcion,
            donaciones.fecha_donacion
        FROM donaciones
        INNER JOIN articulos ON donaciones.id_articulo = articulos.id_articulo
        WHERE donaciones.id_donacion = ?
    `;
    db.query(sql,[id_donacion], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la donación buscada."});
        };
        res.json(rows[0]); 
    }); 
};

const showDonadorName = (req, res) => {
    const { nombre_donador } = req.params;
    console.log(nombre_donador);
    const sql = `
        SELECT 
            donaciones.id_donacion,
            donaciones.nombre_donador,
            articulos.nombre_articulo,
            donaciones.email,
            donaciones.descripcion,
            donaciones.fecha_donacion
        FROM donaciones
        INNER JOIN articulos ON donaciones.id_articulo = articulos.id_articulo
        WHERE donaciones.nombre_donador LIKE ?
    `;
    db.query(sql, [`%${nombre_donador}%`], (error, rows) => {
        console.log(rows);
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: "ERROR: No existe el donador buscado." });
        }
        res.json(rows); // Devuelve todos los resultados
    });
};

//// METODO POST  ////
const insertDonacion = (req, res) => {
    const {nombre_donador, id_articulo, fecha_donacion, email, descripcion} = req.body;
    console.log('BODY DONACION:', req.body);

    // Validación de campos obligatorios
    if (!nombre_donador || !id_articulo || !fecha_donacion || !email || !descripcion) {
        return res.status(400).json({ error: "Faltan datos obligatorios para la donación." });
    }

    const sql = "INSERT INTO donaciones (nombre_donador, id_articulo, fecha_donacion, email, descripcion) VALUES (?,?,?,?,?)";
    db.query(sql,[nombre_donador, id_articulo, fecha_donacion, email, descripcion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        const donacion = {...req.body, id: result.insertId};
        res.status(201).json(donacion);
    });     
};

//// METODO PUT  ////
const updateDonacion = (req, res) => {
    const {id_donacion} = req.params;
    const {nombre_donador, id_articulo, fecha_donacion, email, descripcion} = req.body;
    const sql ="UPDATE donaciones SET nombre_donador = ?, id_articulo = ?, fecha_donacion = ?, email = ?, descripcion = ? WHERE id_donacion = ?";
    db.query(sql,[nombre_donador, id_articulo, fecha_donacion, email, descripcion, id_donacion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La donación a modificar no existe."});
        };
        
        const donacion = {...req.body, ...req.params};
        res.json(donacion);
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
    deleteDonacion,
    getArticulos,
    showDonadorName
};
