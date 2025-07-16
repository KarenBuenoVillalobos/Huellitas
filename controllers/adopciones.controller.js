/// CONTROLADORES DEL MODULO ///

// Campos de la tabla ADOPCIONES
// id_adopcion
// id_usuario
// id_animal
// telefono
// direccion
// fecha_adopcion

const db = require("../db/db");

require("dotenv").config(); // Cargar las variables de entorno desde el archivo .env

//Envio de correos
const nodemailer = require('nodemailer');

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

// POST para /form-adopcion
const insertAdopcionForm = (req, res) => {
    const { nombre_apellido, nombre_animal, telefono, direccion, fecha_adopcion } = req.body;

    // Buscar el id_usuario por nombre_apellido
    const buscarUsuario = `SELECT id_usuario, email FROM usuarios WHERE nombre_apellido = ?`;
    db.query(buscarUsuario, [nombre_apellido], (errorUsuario, rowsUsuario) => {
        if (errorUsuario) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (rowsUsuario.length === 0) {
            return res.status(400).json({ error: "El usuario no existe. Debe registrarse en el sistema antes de adoptar." });
        }
        const id_usuario = rowsUsuario[0].id_usuario;
        const email = rowsUsuario[0].email;

        // Buscar el id_animal por nombre_animal
        const buscarAnimal = `SELECT id_animal FROM animales WHERE nombre_animal = ?`;
        db.query(buscarAnimal, [nombre_animal], (errorAnimal, rowsAnimal) => {
            if (errorAnimal) {
                return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
            }
            if (rowsAnimal.length === 0) {
                return res.status(400).json({ error: "El animal ingresado no está registrado." });
            }
            const id_animal = rowsAnimal[0].id_animal;

            // Insertar la adopción con los IDs
            const sql = `
                INSERT INTO adopciones (id_usuario, id_animal, telefono, direccion, fecha_adopcion)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(sql, [id_usuario, id_animal, telefono, direccion, fecha_adopcion], (error, result) => {
                if (error) {
                    return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
                }

                // Configurar Nodemailer
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASSWORD
                    }
                });

                // Configurar el mensaje con firma digital
                const mailOptions = {
                    from: process.env.MAIL_USER,
                    to: email, // correo del adoptante
                    subject: 'Solicitud de adopción recibida',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #222;">
                            <img src="cid:logoHuellitas" alt="Huellitas de Amor" style="width:100px; margin-bottom: 20px;">
                            <h2>¡Gracias por tu solicitud de adopción!</h2>
                            <p><b>Datos enviados:</b></p>
                            <ul>
                                <li><b>Adoptante:</b> ${nombre_apellido}</li>
                                <li><b>Animal:</b> ${nombre_animal}</li>
                                <li><b>Teléfono:</b> ${telefono}</li>
                                <li><b>Dirección:</b> ${direccion}</li>
                                <li><b>Fecha de visita:</b> ${fecha_adopcion}</li>
                            </ul>
                            <p>Nos pondremos en contacto contigo pronto.</p>
                            <hr style="margin:24px 0;">
                            <div style="font-size:18px; margin-bottom:8px; display:inline-block;">
                                <span style="color:#e573b3; font-weight:bold;">H</span>uellitas de
                                <span style="color:#e573b3; font-weight:bold;">A</span>m
                                <img src="cid:logoHuellitas" alt="o" style="width:17px; height:17px; vertical-align:middle; border-radius:50%; background:#fff; margin:0 -2px; padding:0; display:inline-block;">
                                r
                            </div>
                            <div style="font-size:14px; color:#888;">
                                <span>Tel: 11-1234-5678</span><br>
                                <span>Email: <a href="mailto:huellitasdeamor.adm@gmail.com" style="color:#e573b3;">huellitasdeamor.adm@gmail.com</a></span>
                            </div>
                        </div>
                    `,
                    attachments: [{
                        filename: 'logo.png',
                        path: __dirname + '/../img/logo.png',
                        cid: 'logoHuellitas'
                    }]
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error('Error enviando correo:', err);
                        return res.status(201).json({
                            ...req.body,
                            id: result.insertId,
                            aviso: 'Adopción registrada, pero hubo un error enviando el correo al usuario.'
                        });
                    }
                    res.status(201).json({
                        ...req.body,
                        id: result.insertId,
                        mensaje: 'Adopción registrada y correo enviado correctamente.'
                    });
                });
            });
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
    showAnimalName,
    insertAdopcionForm
};
