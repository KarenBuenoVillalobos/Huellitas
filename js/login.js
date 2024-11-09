const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async(e) => { // (e) es el evento
    e.preventDefault();
    const email = e.target.children.email.value;
    const password = e.target.children.password.value;
    
    // Nos comunicamos con nuestro backend usando fetch
    const res = await fetch("http://localhost:3000/api/login",{
        method:"POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          email, password
        })
      });
      
    if(!res.ok) return mensajeError.classList.toggle("invisible_visible", false);
    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
})