/// CONTROLADORES DEL MODULO ///

// Campos de la tabla DONACIONES
// id_donacion
// id_usuario
// id_articulo
// fecha_donacion
// email
// descripcion

const db = require("../db/db");
require('dotenv').config();

//Envio de correos
const nodemailer = require('nodemailer');

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

const getDonacionesPendientes = (req, res) => {
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
        WHERE donaciones.estado = 'pendiente'
    `;
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

// Insertar donación como pendiente (desde la web pública)
const insertDonacionPendiente = (req, res) => {
    const {nombre_donador, id_articulo, fecha_donacion, email, descripcion} = req.body;
    if (!nombre_donador || !id_articulo || !fecha_donacion || !email || !descripcion) {
        return res.status(400).json({ error: "Faltan datos obligatorios para la donación." });
    }
    const sql = "INSERT INTO donaciones (nombre_donador, id_articulo, fecha_donacion, email, descripcion, estado) VALUES (?,?,?,?,?,?)";
    db.query(sql, [nombre_donador, id_articulo, fecha_donacion, email, descripcion, 'pendiente'], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente más tarde por favor."});
        }
        const donacion = {...req.body, id: result.insertId, estado: 'pendiente'};
        res.status(201).json(donacion);
    });
};

const actualizarEstadoDonacion = (req, res) => {
    const { id_donacion } = req.params;
    const { estado } = req.body;
    if (!estado) {
        return res.status(400).json({ error: "Falta el estado." });
    }
    // Primero, actualiza el estado
    const sql = "UPDATE donaciones SET estado = ? WHERE id_donacion = ?";
    db.query(sql, [estado, id_donacion], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Donación no encontrada." });
        }

        // RESPONDE INMEDIATAMENTE AL FRONTEND
        res.json({ mensaje: "Estado actualizado correctamente." });

        // Si fue aceptada, consulta los datos y envía el mail en segundo plano
        if (estado === 'aceptada') {
            const sqlDatos = `
                SELECT donaciones.email, donaciones.nombre_donador, articulos.nombre_articulo, donaciones.descripcion
                FROM donaciones
                INNER JOIN articulos ON donaciones.id_articulo = articulos.id_articulo
                WHERE donaciones.id_donacion = ?
            `;
            db.query(sqlDatos, [id_donacion], (err, rows) => {
                if (!err && rows.length > 0) {
                    const { email, nombre_donador, nombre_articulo, descripcion } = rows[0];

                    // Configurar Nodemailer
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.MAIL_USER,
                            pass: process.env.MAIL_PASSWORD
                        }
                    });

                    // Configurar el mensaje con firma digital personalizada
                    const mailOptions = {
                        from: process.env.MAIL_USER,
                        to: email,
                        subject: '¡Tu donación fue aceptada!',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #222;">
                            <img src="cid:logoHuellitas" alt="Huellitas de Amor" style="width:100px; margin-bottom: 20px;">
                            <h2>¡Gracias por tu donación!</h2>
                            <p>Tu solicitud fue aceptada por el administrador.</p>
                            <ul>
                                <li><b>Nombre:</b> ${nombre_donador}</li>
                                <li><b>Artículo:</b> ${nombre_articulo}</li>
                                <li><b>Descripción:</b> ${descripcion}</li>
                            </ul>
                            <p>¡Nos pondremos en contacto contigo pronto!</p>
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
                        }
                    });
                }
            });
        }
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
    showDonadorName,
    insertDonacionPendiente,
    getDonacionesPendientes,
    actualizarEstadoDonacion
};
