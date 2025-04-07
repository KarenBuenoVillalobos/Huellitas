/*const db = require('../db/db');

// Insertar una nueva especie
const insertEspecie = (req, res) => {
    const { nombre_especie } = req.body;

    if (!nombre_especie) {
        return res.status(400).json({ error: "El nombre de la especie es obligatorio." });
    }

    const sql = `INSERT INTO especies (nombre_especie) VALUES (?)`;

    db.query(sql, [nombre_especie], (error, result) => {
        if (error) {
            console.error("Error al insertar la especie:", error);
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.status(201).json({ id: result.insertId, nombre_especie });
    });
};

module.exports = {
    insertEspecie,
};
*/