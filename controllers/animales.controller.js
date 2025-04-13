/// CONTROLADORES DEL MODULO ///

// Campos de la tabla ANIMALES
// id_animal
// nombre_animal
// especie
// edad
// descripcion
// imagen

const db = require("../db/db");
const path = require('path');
const fs = require('fs');

//// METODO GET  /////

// Obtener las especies
const getEspecies = (req, res) => {
    const sql = `SELECT id_especie, nombre_especie FROM especies`;
    db.query(sql, (error, rows) => {
        if (error) {
            console.error("Error al obtener las especies:", error);
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

//// METODO POST  ////
const insertAnimal = (req, res) => {
    console.log(req.file);
    let imageName = "";

    if(req.file){
        imageName = req.file.filename;
    };

    const { nombre_animal, id_especie, edad, descripcion } = req.body;

    const sql = `
        INSERT INTO animales (nombre_animal, id_especie, edad, descripcion, foto_animal) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nombre_animal, id_especie, edad, descripcion, imageName], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        const animal = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(animal); // muestra creado con exito el elemento
    });

};


// Para todos los animales
const allAnimal = (req, res) => {
    const sql = `
        SELECT 
            animales.id_animal,
            animales.nombre_animal,
            especies.nombre_especie AS nombre_especie,
            animales.edad,
            animales.descripcion,
            animales.foto_animal
        FROM animales
        INNER JOIN especies ON animales.id_especie = especies.id_especie
    `;
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
    const sql = `
    SELECT 
        animales.id_animal,
        animales.nombre_animal,
        animales.id_especie, -- Agregar el id_especie aquí
        especies.nombre_especie AS especie,
        animales.edad,
        animales.descripcion,
        animales.foto_animal
    FROM animales
    INNER JOIN especies ON animales.id_especie = especies.id_especie
    WHERE animales.id_animal = ?
`;
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

const showAnimalName = (req, res) => {
    const { nombre_animal } = req.params;
    console.log(nombre_animal);
    const sql = `
        SELECT 
            animales.id_animal,
            animales.nombre_animal,
            especies.nombre_especie AS especie,
            animales.edad,
            animales.descripcion,
            animales.foto_animal
        FROM animales
        INNER JOIN especies ON animales.id_especie = especies.id_especie
        WHERE animales.nombre_animal LIKE ?
    `;
    db.query(sql, [`%${nombre_animal}%`], (error, rows) => {
        console.log(rows);
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: "ERROR: No existe el animal buscado." });
        }
        res.json(rows); // Devuelve todos los resultados
    });
};


//// METODO PUT  ////
const updateAnimal = (req, res) => {
    console.log(req.file);
    let imageName = "";

    if (req.file) {
        imageName = req.file.filename; // Si se sube una nueva imagen, se usa el nuevo nombre
    }

    const { id_animal } = req.params;
    const { nombre_animal, id_especie, edad, descripcion } = req.body;

    // Obtener la imagen actual del animal
    const getImageSql = `SELECT foto_animal FROM animales WHERE id_animal = ?`;
    db.query(getImageSql, [id_animal], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo obtener la imagen actual." });
        }

        const currentImage = rows[0]?.foto_animal;

        // Si no se sube una nueva imagen, usar la imagen actual
        if (!req.file) {
            imageName = currentImage;
        }

        // Eliminar la imagen anterior si existe y se subió una nueva
        if (currentImage && req.file) {
            const imagePath = `uploads/${currentImage}`;
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error al eliminar la imagen anterior:", err);
                } else {
                    console.log("Imagen anterior eliminada:", imagePath);
                }
            });
        }

        // Actualizar los datos del animal en la base de datos
        const updateSql = `
            UPDATE animales 
            SET 
                nombre_animal = ?, 
                id_especie = ?, 
                edad = ?, 
                descripcion = ?, 
                foto_animal = ? 
            WHERE id_animal = ?
        `;

        db.query(updateSql, [nombre_animal, id_especie, edad, descripcion, imageName, id_animal], (error, result) => {
            if (error) {
                return res.status(500).json({ error: "ERROR: No se pudo actualizar el animal." });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send({ error: "ERROR: El animal a modificar no existe." });
            }

            const animal = { ...req.body, id_animal, foto_animal: imageName }; // Reconstruir el objeto del body
            res.json(animal);
        });
    });
};


//// METODO DELETE ////
const deleteAnimal = (req, res) => {
    const { id_animal } = req.params;

    // Obtener el nombre del archivo de la imagen del animal
    const getImageSql = `SELECT foto_animal FROM animales WHERE id_animal = ?`;
    db.query(getImageSql, [id_animal], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo obtener la imagen del animal." });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: "ERROR: El animal no existe." });
        }

        const imageName = rows[0].foto_animal;

        // Eliminar el archivo de la carpeta uploads
        if (imageName) {
            const imagePath = path.join(__dirname, '../uploads', imageName);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error al eliminar la imagen:", err);
                } else {
                    console.log("Imagen eliminada:", imagePath);
                }
            });
        }

        // Eliminar el registro de la base de datos
        const deleteSql = `DELETE FROM animales WHERE id_animal = ?`;
        db.query(deleteSql, [id_animal], (error, result) => {
            if (error) {
                return res.status(500).json({ error: "ERROR: No se pudo eliminar el animal." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "ERROR: El animal no existe." });
            }

            res.json({ mensaje: "Animal eliminado con éxito." });
        });
    });
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allAnimal,
    showAnimal,
    insertAnimal,
    updateAnimal,
    deleteAnimal,
    showAnimalName,
    getEspecies,
};
