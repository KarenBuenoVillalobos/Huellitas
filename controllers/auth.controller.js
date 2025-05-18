// Código cortesía del repositorio de Leonel Girett 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/db"); // Importar la conexión a la base de datos

//Localidades
const localidades = (req, res) => {
        const sql =`SELECT id_localidad, descripcion FROM localidades`;
        db.query(sql, (error, rows) => {
            if (error) {
                console.error("Error al obtener localidades:", error);
                return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
            }
            res.json(rows);
        });
};
//Generos
const generos = (req, res) => {
    const sql =`SELECT id_genero, descripcion FROM genero`;
    db.query(sql, (error, rows) => {
        if (error) {
            console.error("Error al obtener generos:", error);
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor." });
        }
        res.json(rows);
    });
};

// Función para registrar usuario
const register = (req, res) => {

    // Verificar si se ha subido una imagen
    let imageName = "";
    if (req.file) {
        imageName = req.file.filename;
    }
    const { nombre_apellido, email, id_localidad, id_genero, password } = req.body;

    // Validar campos requeridos
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error("Registration error:", error);
            return res.status(500).json({ success: false, message: "Error al verificar el usuario." });
        }
        // Verificar si el correo ya está registrado
        if (results.length > 0) {
            return res.status(200).json({ success: false, existe: true, message: "El correo ya está registrado." });
        }
        // Validar que la contraseña tenga al menos 6 caracteres
        bcrypt.hash(password, 8, (err, hash) => {
            if (err) {
                console.error("Error al encriptar la contraseña.:", err);
                return res.status(500).json({ success: false, message: "Error al encriptar la contraseña." });
            }

            // Insertar el nuevo usuario en la base de datos
            db.query(
                'INSERT INTO usuarios (nombre_apellido, email, id_localidad, id_genero, password, foto_usuario, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nombre_apellido, email, id_localidad, id_genero, hash, imageName, 2],
                (insertError, insertResults) => {
                    if (insertError) {
                        console.error("Error inserting user:", insertError);
                        return res.status(500).json({ success: false, message: "Error registering user" });
                    }

                    // Generar un token JWT con el ID del usuario
                    const id_usuario = insertResults.insertId;

                    // Generar el token JWT
                    const token = jwt.sign({ id: id_usuario }, process.env.SECRET_KEY, {
                        expiresIn: "1h",
                    });

                    res.status(201).json({ success: true, auth: true, token });
                }
            );
        });
    });
};


const login = (req, res) => {    
    const { email, password } = req.body;

    // Verificar si el usuario existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error("Login error:", error);
            return res.status(500).json({ auth: false, message: "Error al intentar iniciar sesión." });
        }

        // Si no se encuentra el usuario, enviar respuesta de error
        if (results.length === 0) {
            return res.status(404).json({ auth: false, message: "Usuario no encontrado." });
        }

        const usuario = results[0];
        // Verificar la contraseña
        bcrypt.compare(password, usuario.password, (err, passwordIsValid) => {
            if (err) {
                console.error("Error comparando contraseñas:", err);
                return res.status(500).json({ auth: false, message: "Error al comparar contraseñas." });
            }

            if (!passwordIsValid) {
                return res.status(401).json({ auth: false, message: "Contraseña incorrecta." });
            }

            // Generar un token JWT con el ID del usuario
            const token = jwt.sign({ id: usuario.id_usuario }, process.env.SECRET_KEY, {
                expiresIn: "1h",
            });
            // Enviar respuesta con el token y los datos del usuario
            res.json({
                auth: true,
                token,
                id_rol: usuario.id_rol,
                nombre: usuario.nombre_apellido,
                foto: usuario.foto_usuario
            });
        });
    });
};

module.exports = {
    localidades,
    generos,
    register,
    login,
};