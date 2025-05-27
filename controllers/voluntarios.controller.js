/// CONTROLADORES DEL MODULO ///

// Campos de la tabla VOLUNTARIOS
// id_volutario
// asignacion

const db = require("../db/db");
require("dotenv").config(); // Cargar las variables de entorno desde el archivo .env

//Envio de correos
const nodemailer = require('nodemailer');

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
            voluntarios.email,
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
        voluntarios.email,
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

const showVoluntarioAsignacion = (req, res) => {
    const { asignacion } = req.params;
    const sql = `
        SELECT 
            voluntarios.id_voluntario,
            voluntarios.email,
            asignaciones.nombre_asignacion AS asignacion,
            voluntarios.tarea
        FROM voluntarios
        INNER JOIN asignaciones ON voluntarios.id_asignacion = asignaciones.id_asignacion
        WHERE asignaciones.nombre_asignacion LIKE ?
    `;
    db.query(sql, [`%${asignacion}%`], (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: "ERROR: No existe el voluntario buscado." });
        }
        res.json(rows);
    });
};

//// METODO POST  ////
const insertVoluntario = (req, res) => {
    const { email, id_asignacion, tarea } = req.body;
    const sql = `
        INSERT INTO voluntarios (email, id_asignacion, tarea) 
        VALUES (?, ?, ?)
    `;
    db.query(sql, [email, id_asignacion, tarea], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }

        // Consultar el nombre de la asignación
        const sqlAsignacion = 'SELECT nombre_asignacion FROM asignaciones WHERE id_asignacion = ?';
        db.query(sqlAsignacion, [id_asignacion], (err, rows) => {
            let nombreAsignacion = id_asignacion;
            if (!err && rows.length > 0) {
                nombreAsignacion = rows[0].nombre_asignacion;
            }

            // Configurar Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD
                }
            });

            // Configurar el mensaje
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: `${email}`,
                subject: 'Solicitud de voluntariado recibida',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #222;">
                        <img src="cid:logoHuellitas" alt="Huellitas de Amor" style="width:100px; margin-bottom: 20px;">
                        <h2>¡Gracias por tu solicitud!</h2>
                        <p><b>Datos enviados:</b></p>
                        <ul>
                            <li><b>Correo:</b> ${email}</li>
                            <li><b>Asignación:</b> ${nombreAsignacion}</li>
                            <li><b>Tarea:</b> ${tarea}</li>
                        </ul>
                        <p>Nos pondremos en contacto contigo pronto.</p>
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
                        aviso: 'Voluntario registrado, pero hubo un error enviando el correo al administrador.'
                    });
                }
                const voluntario = { ...req.body, id: result.insertId };
                res.status(201).json({
                    ...voluntario,
                    mensaje: 'Voluntario registrado y correo enviado al administrador correctamente.'
                });
            });
        });
    });     
};

//// METODO PUT  ////
const updateVoluntario = (req, res) => {
    const { id_voluntario } = req.params;
    const { email, id_asignacion, tarea } = req.body;
    const sql = `
        UPDATE voluntarios 
        SET
            email = ?,
            id_asignacion = ?, 
            tarea = ? 
        WHERE id_voluntario = ?
    `;
    db.query(sql, [email, id_asignacion, tarea, id_voluntario], (error, result) => {
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
    getAsignaciones,
    showVoluntarioAsignacion
};
