// Crear la lista de tareas

let tasks = []; // crear un lista o array vacio

const form = document.querySelector(".form_task"); // Formulario
const taskInput = document.querySelector("#taskInput"); // Input
const taskInputEdad = document.querySelector("#taskInputEdad"); // Input
const selectTipoEdad = document.querySelector("#select__tipoedad"); // Input
const taskInputDescrip = document.querySelector("#taskInputDescrip"); // Input
const taskList = document.querySelector("#taskList"); // Lista li

// Mostrar las tareas en HTML
const renderTasks = () => {  //render seria Presentacion, en este caso presentar tareas
    taskList.innerHTML = ""; // Borrar toda la infor del ul
    tasks.forEach((task) => {
        // Dinamico con el texto ingresado en el input
        const html = `
            <li data-id="${task.id}" class="tasks__item">
                <p class="${task.completa && "done"}">${task.txt_tarea}</p>
                <p class="${task.completa && "done"}">${task.edad + " " + task.tipoEdad}</p>
                <p class="${task.completa && "done"}">${task.txt_descrip}</p>
                <div>
                    <i class="bx bx-check"></i>
                    <i class="bx bx-trash"></i>
                </div>
            </li>
        `;
        // class="tasks-item" era el error en li
        taskList.innerHTML += html;
    })
}

form.addEventListener("submit", async (event) => {
    event.preventDefault(); //tomo el control del evento, lo atrapo porque sino se va
    const txt_tarea = (taskInput.value.trim()); //guarda el valor del input sin espacios (al principio y fin) en una variable
    const edad = parseInt(taskInputEdad.value); // convertir a numero
    const tipoEdad = selectTipoEdad.options[selectTipoEdad.selectedIndex].text;
    const txt_descrip = (taskInputDescrip.value.trim()); //guarda el valor del input sin espacios (al principio y fin) en una variable

    let erroresValidacion = false;

    if (txt_tarea.length < 3) {
        erroresValidacion = true;
        const error = document.querySelector(".error-nombre");
        error.textContent = "El nombre debe contener al menos 3 caracteres.";

        setTimeout(() => {
            error.textContent = "";
        }, 4000); // 4.000 milisengundos = 4 segundos
    }

    if (edad === 0) {
        erroresValidacion = true;
        const error = document.querySelector(".error-edad");
        error.textContent = "Se debe agregar edad.";
        
        setTimeout(() => {
            error.textContent = "";
        }, 4000); // 4.000 milisengundos = 4 segundos
    }
    if (isNaN(edad) || edad < 0) {
        erroresValidacion = true;
        const error = document.querySelector(".error-edad");
        error.textContent = "La edad debe ser mayor a 0.";
        
        setTimeout(() => {
            error.textContent = "";
        }, 4000); // 4.000 milisengundos = 4 segundos
    }

    if (txt_descrip.length === 0) {
        erroresValidacion = true;
        const error = document.querySelector(".error-descrip");
        error.textContent = "Se debe agregar descripción.";
        
        setTimeout(() => {
            error.textContent = "";
        }, 4000); // 4.000 milisengundos = 4 segundos
    }

    if (!erroresValidacion) { //Si no hay errores, procede a crear la tarea
        const task = {
            //id: Date.now(), // nos da la cantidad de milisegundos desde 01/01/1970. Genero un numero unico
            txt_tarea: txt_tarea,
            edad: parseInt(edad),
            tipoEdad: tipoEdad,
            txt_descrip: txt_descrip,
            completa: false,
        }        

        // MODIFICO ESTAS LINEAS DE CODIGO USANDO TRY - CATCH */

        // try {
        //     const response = await fetch('http://localhost:3000/tasks', {
        //         method: 'POST',
        //         body: JSON.stringify(task),  // TAREA CREADA EN LA LINEA 42
        //         headers: {
        //             'Content-type': 'application/json; charset=UTF-8',
        //         },
        //     })

        //     const json = await response.json(); // ESPERO A QUE ESA RESPUESTA SE TRANSFORME EN UN JSON
        //     task.id = json.id;
        //     tasks.push(task); // AGREGUE LA TAREA A LA LISTA DE TAREAS

        // } catch (error) {
        //     console.log(error);
        // }

        tasks.push(task); // Agrego la tarea a la lista de tareas
        console.log(tasks);
 
        // Almaceno las tareas en el localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));

        taskInput.value = ""; // limpiar el texto en el input //es lo mismo que poner con el evento focus
        taskInputEdad.value = "";
        selectTipoEdad.selectedIndex = 0;
        taskInputDescrip.value = "";
        renderTasks();
    }
})

// VAMOS A OBTENER li
taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("bx-check")) {
        const id = event.target.closest("li").dataset.id;
        const task = tasks.find((task) => task.id == id);

        task.completa = !task.completa; 
        console.log(task);

        renderTasks();

        // fetch(`http://localhost:3000/tasks/${id}`, { // CAMBIO URL Y ID
        //     method: 'PUT',
        //     body: JSON.stringify(task),
        //     headers: {
        //         'Content-type': 'application/json; charset=UTF-8',
        //     },
        // })
        //     .then((response) => response.json())
        //     .then((json) => console.log(json))
        //     .catch((error) => console.log(error)); // AGREGAMOS A LA DOCs CATCH

        event.target.closest("li").querySelector("p").classList.toggle("done");

        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    if (event.target.classList.contains("bx-trash")) {
        const id = event.target.closest("li").dataset.id;
        const taskIndex = tasks.find((task) => task.id == id);

        tasks.splice(taskIndex, 1);

        // fetch(`http://localhost:3000/tasks/${id}`, { // CAMBIO URL Y ID
        //     method: 'DELETE',
        // });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        event.target.closest("li").remove();
    }
});

document.addEventListener("DOMContentLoaded", () => {

    // fetch("http://localhost:3000/tasks") // NO NECESITO PONER EL METODO GET
    //     .then((response) => response.json())
    //     .then((json) => {
    //         tasks = json;
    //         renderTasks();
    //     })
    
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();

});
