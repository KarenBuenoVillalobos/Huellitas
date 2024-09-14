let header = '<a href="index.html" class="logo"><img id="logo" src="img/logo.png" alt="huellitas-de-amor"></a><input type="checkbox" id="check"><label for="check" class="mostrar-menu">&#8801</label><nav class="menu"><a href="index.html">Home</a><a href="nosotros.html">Nosotros</a><a href="adopta.html">Adopta</a><a href="contacto.html">Contacto</a><a href="donar.html">Donar</a><label for="check" class="esconder-menu">&#215</label></nav>';
document.getElementById('header').innerHTML = header;

let footer = '<a href="https://www.facebook.com" target="_blank"><img src="img/ico-facebook.ico" alt="Facebook"></a><a href="https://www.instagram.com" target="_blank"><img src="img/ico-instagram.ico" alt="Instagram"></a><a href="https://www.whatsapp.com" target="_blank"><img src="img/ico-whatsapp.ico" alt="WhatsApp"></a><a href="https://www.twitter.com" target="_blank"><img src="img/ico-twitter.ico" alt="Twitter"></a><a href="https://www.youtube.com" target="_blank"><img src="img/ico-youtube.ico" alt="Youtube"></a><p>Derechos reservados © 2024</p><p>Terminos y condiciones</p><p>Soporte</p>';
document.getElementById('footer').innerHTML = footer;

//-----------------------------------------------------

let tasks = []; // crea un array vacio (listas)

const form = document.querySelector(".form_task");
const taskInput = document.querySelector("#taskInput");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const txt_tarea = (taskInput.value.trim());

    let erroresValidacion = false;
    
    if(txt_tarea.length < 5){
        erroresValidacion = true;
        const error = document.querySelector(".error")
        error.textContent = "El texto de la tarea debe contener al menos 5 caractres";
        //console.log(txt_tarea);

        setTimeout(() => {
            error.textContent = "";
        }, 4000); // 4.000 milisegundos
    } 

    if(!erroresValidacion){
       // console.log(txt_tarea);
       const task = {
            id: Date.now(), // nos da la cantidad de milisegundos desde 01/01/1970. Genero un numero unico
            txt_tarea: txt_tarea,
            completa: false,
       };
       
       //console.log(task);

       tasks.push(task); // Agrego la tarea a la lista de tareas
       console.log(tasks);

       //taskInput.value = ""; // limpiar el campo de la tarea (input)
       form.reset();
    }

})