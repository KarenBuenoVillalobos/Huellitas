const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("registro-form").addEventListener("submit", async(e) => { // (e) es el evento
    e.preventDefault();
    // console.log(e.target.children.nombre_apellido.value);
    // console.log(e.target.children.email.value);
    // console.log(e.target.elements.localidad.options[e.target.elements.localidad.selectedIndex].text);
    // console.log(e.target.querySelector('input[name="genero"]:checked')?.nextElementSibling.textContent);
    // console.log(e.target.children.password.value);
    // console.log(e.target.children['confirm-password'].value);
    // console.log(e.target.children.foto_usuario.value)
    
    const nombre_apellido = document.getElementById("nombre_apellido").value;
    const email = document.getElementById("email").value;
    const localidad = document.getElementById("localidad").value;
    const genero = document.querySelector('input[name="genero"]:checked')?.nextElementSibling.textContent;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const foto_usuario = document.getElementById("foto_usuario").value;

    // Nos comunicamos con nuestro backend usando fetch
    const res = await fetch("http://localhost:3000/auth/registro",{
        method:"POST",
        headers:{
          "Content-Type" : "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          // nombre_apellido: e.target.children.nombre_apellido.value,
          // email: e.target.children.email.value,
          // localidad: e.target.children.localidad.value,
          // genero: e.target.children.genero.value,
          // passwordRegistro: e.target.children.password.value,
          // confirmPassword: e.target.children.confirm-password.value,
          // foto_usuario: e.target.children.foto_usuario.value
          nombre_apellido: nombre_apellido,
          email: email,
          localidad: localidad,
          genero: genero,
          passwordRegistro: password,
          confirmPassword: confirmPassword,
          foto_usuario: foto_usuario
        })
      });
      
    if(!res.ok) return mensajeError.classList.toggle("invisible_visible", false);
    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
})