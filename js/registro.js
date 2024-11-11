// let registros = []; // crear un lista o array vacio

// form.addEventListener("submit", async (event) => {
// document.getElementById("registro-form").addEventListener("submit", function(e) {
document.getElementById("registro-form").addEventListener("submit", async(e) => { // (e) es el evento    
    e.preventDefault();
    const nombre_apellido = document.getElementById("nombre_apellido").value;
    const email = document.getElementById("email").value;
    const localidad = document.getElementById("localidad").value;
    const genero = document.querySelector('input[name="genero"]:checked')?.nextElementSibling.textContent;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    // const foto_usuario = document.getElementById("foto_usuario").value;
    const foto_usuario = document.getElementById("foto_usuario").files[0];
console.log(nombre_apellido)

    const registro = {
        nombre_apellido: nombre_apellido,
        email: email,
        localidad: localidad,
        genero: genero,
        password: password,
        confirmPassword: confirmPassword,
        foto_usuario: foto_usuario,
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

    registros.push(registro); // Agrego la tarea a la lista de tareas
    console.log(registros);


    nombre_apellido.value = ""; // limpiar el texto en el input //es lo mismo que poner con el evento focus
    email.value = "";
    localidad.selectedIndex = 0;
    genero.checked = false;
    password.value = "";
    confirmPassword.value = "";
    foto_usuario.value = "";
    // renderTasks();
});