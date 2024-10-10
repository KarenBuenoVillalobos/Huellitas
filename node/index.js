const express = require("express");
const app = express();

// Nueva ruta POST para agregar tareas
let tasks = []; // Aquí guardaremos las tareas
app.post("/tasks", (req, res) => {
    const newTask = req.body; // Obtener la tarea enviada desde el frontend
    newTask.id = Date.now(); // Generar un ID único usando la fecha actual
    tasks.push(newTask); // Agregar la tarea al arreglo
    res.json(newTask); // Devolver la tarea recién creada con el ID
});

const PORT = 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
