// Código cortesía del repositorio de Leonel Girett 

/// CONTROLADORES DEL MODULO ///

// Campos de la tabla USUARIOS
// id_adopcion
// nombre_apellido
// email
// sexo
// localidad
// password
// imagen

const db = require("../db/db");
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');


// Obtener todas las localidades
const getLocalidades = (req, res) => {
    const sql = `SELECT id_localidad, descripcion FROM localidades`;
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudieron obtener las localidades." });
        }
        res.json(rows);
    });
};

// Obtener todos los generos
const getGeneros = (req, res) => {
    const sql = `SELECT id_genero, descripcion FROM genero`;
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudieron obtener los géneros." });
        }
        res.json(rows);
    });
};
// Obtener todos los roles
const getRoles = (req, res) => {
    const sql = `SELECT id_rol, descripcion FROM roles`;
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudieron obtener los roles." });
        }
        res.json(rows);
    });
}

//// METODO GET  /////

const allUsuario = (req, res) => {
    const sql = `
        SELECT 
            usuarios.id_usuario,
            usuarios.nombre_apellido,
            usuarios.email,
            usuarios.password,
            usuarios.foto_usuario,
            localidades.descripcion AS localidad,
            genero.descripcion AS genero,
            roles.descripcion AS rol
        FROM usuarios
        LEFT JOIN localidades ON usuarios.id_localidad = localidades.id_localidad
        LEFT JOIN genero ON usuarios.id_genero = genero.id_genero
        LEFT JOIN roles ON usuarios.id_rol = roles.id_rol
    `;
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

const showUsuario = (req, res) => {
    const { id_usuario } = req.params;
    const sql = `
        SELECT 
            usuarios.id_usuario,
            usuarios.nombre_apellido,
            usuarios.email,
            usuarios.password,
            usuarios.foto_usuario,
            usuarios.id_localidad,                -- <--- AGREGA ESTO
            localidades.descripcion AS localidad,
            usuarios.id_genero,                   -- <--- AGREGA ESTO
            genero.descripcion AS genero,
            usuarios.id_rol,                      -- <--- AGREGA ESTO
            roles.descripcion AS rol
        FROM usuarios
        LEFT JOIN localidades ON usuarios.id_localidad = localidades.id_localidad
        LEFT JOIN genero ON usuarios.id_genero = genero.id_genero
        LEFT JOIN roles ON usuarios.id_rol = roles.id_rol
        WHERE usuarios.id_usuario = ?
    `;
    db.query(sql, [id_usuario], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: "ERROR: No existe el usuario buscado." });
        }
        res.json(rows[0]); // Devuelve el usuario encontrado
    });
};

// Buscar usuarios por nombre
const buscarUsuarioPorNombre = (req, res) => {
    const { nombre } = req.params;
    const sql = `
        SELECT 
            usuarios.id_usuario,
            usuarios.nombre_apellido,
            usuarios.email,
            usuarios.password,
            usuarios.foto_usuario,
            localidades.descripcion AS localidad,
            genero.descripcion AS genero,
            roles.descripcion AS rol
        FROM usuarios
        LEFT JOIN localidades ON usuarios.id_localidad = localidades.id_localidad
        LEFT JOIN genero ON usuarios.id_genero = genero.id_genero
        LEFT JOIN roles ON usuarios.id_rol = roles.id_rol
        WHERE usuarios.nombre_apellido LIKE ?
    `;
    db.query(sql, [`%${nombre}%`], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

// Buscar usuarios por email
const buscarUsuarioPorEmail = (req, res) => {
    const { email } = req.params;
    const sql = `
        SELECT 
            usuarios.id_usuario,
            usuarios.nombre_apellido,
            usuarios.email,
            usuarios.password,
            usuarios.foto_usuario,
            localidades.descripcion AS localidad,
            genero.descripcion AS genero,
            roles.descripcion AS rol
        FROM usuarios
        LEFT JOIN localidades ON usuarios.id_localidad = localidades.id_localidad
        LEFT JOIN genero ON usuarios.id_genero = genero.id_genero
        LEFT JOIN roles ON usuarios.id_rol = roles.id_rol
        WHERE usuarios.email LIKE ?
    `;
    db.query(sql, [`%${email}%`], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

//// METODO POST ////
const createUsuario = (req, res) => {
    let imageName = "";

    if (req.file) {
        imageName = req.file.filename;
    }

    const { nombre_apellido, email, id_localidad, id_genero, password, id_rol } = req.body;

    if (!nombre_apellido || !email || !id_localidad || !id_genero || !password || !id_rol) {
        return res.status(400).json({ error: "ERROR: Todos los campos son obligatorios." });
    }

    // Encriptar la contraseña igual que en register (salt de 8)
    bcrypt.hash(password, 8, (err, hash) => {
        if (err) {
            console.error("Error al encriptar la contraseña:", err);
            return res.status(500).json({ error: "ERROR: No se pudo encriptar la contraseña." });
        }

        const sql = `
            INSERT INTO usuarios (nombre_apellido, email, id_localidad, id_genero, password, foto_usuario, id_rol)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [nombre_apellido, email, id_localidad, id_genero, hash, imageName, id_rol], (error, result) => {
            if (error) {
                console.error("Error en la consulta SQL:", error);
                return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
            }
            const login = { ...req.body, foto_usuario: imageName };
            res.status(201).json(login);
        });
    });
};

//// METODO PUT  ////
const updateUsuario = (req, res) => {
    console.log(req.file);
    // Verificar si se subió una nueva imagen
    // Si no se subió una nueva imagen, se mantendrá la imagen anterior
    let imageName = "";

    if (req.file) {
        imageName = req.file.filename;
    }

    const { id_usuario } = req.params;
    const { nombre_apellido, email, id_localidad, id_genero, password, id_rol } = req.body;

    if (!nombre_apellido || !email || !id_localidad || !id_genero || !password || !id_rol) {
        return res.status(400).json({ error: "ERROR: Todos los campos son obligatorios." });
    }

    // Obtener la imagen anterior si no se subió una nueva
    const getImageSql = `SELECT foto_usuario FROM usuarios WHERE id_usuario = ?`;
    db.query(getImageSql, [id_usuario], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "ERROR: No se pudo obtener la imagen actual." });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "ERROR: El usuario a modificar no existe." });
        }

        const oldImage = rows[0].foto_usuario;

        // Si hay nueva imagen, eliminar la anterior del disco
        if (imageName && oldImage) {
            const oldImagePath = path.join(__dirname, '../uploads/usuario', oldImage);
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error("Error al eliminar la imagen anterior:", err);
                }
            });
        }

        if (!imageName) {
            imageName = oldImage;
        }

        // Encriptar la contraseña antes de actualizar
        bcrypt.hash(password, 8, (hashErr, hash) => {
            if (hashErr) {
                return res.status(500).json({ error: "ERROR: No se pudo encriptar la contraseña." });
            }

            const sql = `
                UPDATE usuarios 
                SET 
                    nombre_apellido = ?, 
                    email = ?, 
                    id_localidad = ?, 
                    id_genero = ?, 
                    password = ?, 
                    foto_usuario = ?, 
                    id_rol = ? 
                WHERE id_usuario = ?
            `;

            db.query(sql, [nombre_apellido, email, id_localidad, id_genero, hash, imageName, id_rol, id_usuario], (error, result) => {
                if (error) {
                    console.error("Error en la consulta SQL:", error);
                    return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
                }
                if (result.affectedRows == 0) {
                    return res.status(404).send({ error: "ERROR: El usuario a modificar no existe." });
                }

                const login = { ...req.body, ...req.params, foto_usuario: imageName };
                res.json(login);
            });
        });
    });
};

// Eliminar un usuario
const deleteUsuario = (req, res) => {
    const { id_usuario } = req.params;

    // Obtener el nombre del archivo de la imagen del usuario
    const getImageSql = `SELECT foto_usuario FROM usuarios WHERE id_usuario = ?`;
    db.query(getImageSql, [id_usuario], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: No se pudo obtener la imagen del usuario." });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: "ERROR: El usuario no existe." });
        }

        const imageName = rows[0].foto_usuario;

        // Eliminar el archivo de la carpeta uploads/usuario
        if (imageName) {
            const imagePath = path.join(__dirname, '../uploads/usuario', imageName);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error al eliminar la imagen:", err);
                } else {
                    console.log("Imagen eliminada:", imagePath);
                }
            });
        }

        // Eliminar el registro de la base de datos
        const deleteSql = `DELETE FROM usuarios WHERE id_usuario = ?`;
        db.query(deleteSql, [id_usuario], (error, result) => {
            if (error) {
                return res.status(500).json({ error: "ERROR: No se pudo eliminar el usuario." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "ERROR: El usuario a borrar no existe." });
            }

            res.json({ mensaje: "Usuario eliminado con éxito." });
        });
    });
};

// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    getLocalidades,
    getGeneros,
    getRoles,
    allUsuario,
    showUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    buscarUsuarioPorNombre,
    buscarUsuarioPorEmail
};