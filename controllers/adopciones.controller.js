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
// Obtener los animales
const getAnimales = (req, res) => {
    const sql = `SELECT id_animal, nombre_animal FROM animales`;
    db.query(sql, (error, rows) => {
        if (error) {
            console.error("Error al obtener los animales:", error);
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

// // Obtener los animales disponibles para adopción
// const getAnimalesDisponibles = (req, res) => {
//     const sql = `
//         SELECT a.id_animal, a.nombre_animal
//         FROM animales a
//         WHERE a.id_animal NOT IN (SELECT id_animal FROM adopciones)
//     `;
//     db.query(sql, (error, rows) => {
//         if (error) {
//             return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
//         }
//         res.json(rows);
//     });
// };

// Para todos las adopciones
const allAdopcion = (req, res) => {
    const sql = `
        SELECT 
            adopciones.*,
            usuarios.nombre_apellido AS nombre_usuario,
            animales.nombre_animal AS nombre_animal
        FROM adopciones
        INNER JOIN usuarios ON adopciones.id_usuario = usuarios.id_usuario
        INNER JOIN animales ON adopciones.id_animal = animales.id_animal
    `;
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

// Para una adopcion
const showAdopcion = (req, res) => {
    const { id_adopcion } = req.params;
    const sql = `
        SELECT 
            adopciones.id_adopcion,
            adopciones.id_animal,
            usuarios.nombre_apellido AS nombre_apellido,
            animales.nombre_animal AS nombre_animal,
            adopciones.telefono,
            adopciones.direccion,
            adopciones.fecha_adopcion
        FROM adopciones
        INNER JOIN usuarios ON adopciones.id_usuario = usuarios.id_usuario
        INNER JOIN animales ON adopciones.id_animal = animales.id_animal
        WHERE adopciones.id_adopcion = ?
    `;
    db.query(sql, [id_adopcion], (error, rows) => {
        console.log(rows);
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (rows.length == 0) {
            return res.status(404).send({ error: "ERROR: No existe la adopción buscada." });
        };
        res.json(rows[0]);
        // me muestra el elemento en la posicion cero si existe.
    });
};

const showAdoptanteName = (req, res) => {
    const { nombre_apellido } = req.params;
    console.log(nombre_apellido);
    const sql = `
        SELECT 
            adopciones.id_adopcion,
            usuarios.nombre_apellido AS nombre_apellido,
            animales.nombre_animal AS nombre_animal,
            adopciones.telefono,
            adopciones.direccion,
            adopciones.fecha_adopcion
        FROM adopciones
        INNER JOIN usuarios ON adopciones.id_usuario = usuarios.id_usuario
        INNER JOIN animales ON adopciones.id_animal = animales.id_animal
        WHERE usuarios.nombre_apellido LIKE ?
    `;
    db.query(sql, [`%${nombre_apellido}%`], (error, rows) => {
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

const showAnimalName = (req, res) => {
    const { nombre_animal } = req.params;
    const sql = `
        SELECT 
            adopciones.id_adopcion,
            usuarios.nombre_apellido AS nombre_apellido,
            animales.nombre_animal AS nombre_animal,
            adopciones.telefono,
            adopciones.direccion,
            adopciones.fecha_adopcion
        FROM adopciones
        INNER JOIN usuarios ON adopciones.id_usuario = usuarios.id_usuario
        INNER JOIN animales ON adopciones.id_animal = animales.id_animal
        WHERE animales.nombre_animal LIKE ?
    `;
    db.query(sql, [`%${nombre_animal}%`], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: "ERROR: No existe el animalito buscado." });
        }
        res.json(rows);
    });
};

//// METODO POST  ////
// const insertAdopcion = (req, res) => {
//     const { id_usuario, id_animal, telefono, direccion, fecha_adopcion } = req.body;
//     const sql = "INSERT INTO adopciones (id_usuario, id_animal, telefono, direccion, fecha_adopcion) VALUES (?,?,?,?,?)";
//     db.query(sql, [id_usuario, id_animal, telefono, direccion, fecha_adopcion], (error, result) => {
//         console.log(result);
//         if (error) {
//             return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
//         }
//         const adopcion = { ...req.body, id: result.insertId }; // ... reconstruir el objeto del body
//         res.status(201).json(adopcion); // muestra creado con exito el elemento
//     });

// };
const insertAdopcion = (req, res) => {
    const { nombre_apellido, id_animal, telefono, direccion, fecha_adopcion } = req.body;

    // Buscar usuario por nombre_apellido
    const buscarUsuario = `SELECT id_usuario FROM usuarios WHERE nombre_apellido = ?`;
    db.query(buscarUsuario, [nombre_apellido], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (rows.length === 0) {
            return res.status(400).json({ error: "El nombre ingresado no está registrado como usuario." });
        }
        const id_usuario = rows[0].id_usuario;

        // Insertar la adopción
        const sql = `INSERT INTO adopciones (id_usuario, id_animal, telefono, direccion, fecha_adopcion) VALUES (?,?,?,?,?)`;
        db.query(sql, [id_usuario, id_animal, telefono, direccion, fecha_adopcion], (error, result) => {
            if (error) {
                return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
            }
            const adopcion = { ...req.body, id: result.insertId };
            res.status(201).json(adopcion);
        });
    });
};

//// METODO PUT  ////
const updateAdopcion = (req, res) => {
    const { id_adopcion } = req.params;
    const { id_animal, telefono, direccion, fecha_adopcion } = req.body;

    // Actualizar los datos del animal en la base de datos
    const updateSql = `
        UPDATE adopciones
        SET 
            id_animal = ?,
            telefono = ?,
            direccion = ?,
            fecha_adopcion = ?
        WHERE id_adopcion = ?
    `;

    db.query(updateSql, [id_animal, telefono, direccion, fecha_adopcion, id_adopcion], (error, result) => {
        console.log(result);
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (result.affectedRows == 0) {
            return res.status(404).send({ error: "ERROR: La adopción a modificar no existe." });
        };

        const adopcion = { ...req.body, ...req.params }; // ... reconstruir el objeto del body

        res.json(adopcion); // mostrar el elmento que existe
    });
};


//// METODO DELETE ////
const deleteAdopcion = (req, res) => {
    const { id_adopcion } = req.params;
    const sql = "DELETE FROM adopciones WHERE id_adopcion = ?";
    db.query(sql, [id_adopcion], (error, result) => {
        console.log(result);
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (result.affectedRows == 0) {
            return res.status(404).send({ error: "ERROR: La adopción a borrar no existe." });
        };
        res.json({ mensaje: "Adopcion Borrada" });
    });
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allAdopcion,
    showAdopcion,
    insertAdopcion,
    updateAdopcion,
    deleteAdopcion,
    getAnimales,
    showAdoptanteName,
    showAnimalName
    // getAnimalesDisponibles
};
