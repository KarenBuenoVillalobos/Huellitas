document.addEventListener('DOMContentLoaded', async () => {
    // Cargar localidades
    const select = document.getElementById('select-localidad');
    try {
        const res = await fetch('/auth/localidades');
        const localidades = await res.json();
        localidades.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.id_localidad;
            option.textContent = loc.descripcion;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Error al cargar localidades', err);
    }

    // Cargar géneros dinámicamente como radio buttons
    const generoContainer = document.getElementById('container-genero');
    try {
        const res = await fetch('/auth/generos');
        const generos = await res.json();
        generos.forEach(gen => {
            const label = document.createElement('label');
            label.style.marginRight = "15px";
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'id_genero';
            radio.value = gen.id_genero;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(' ' + gen.descripcion));
            generoContainer.appendChild(label);
        });
    } catch (err) {
        console.error('Error al cargar generos', err);
    }

    // Registro
    const form = document.getElementById('form-registro');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            try {
                const res = await fetch('/auth/registro', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    alert('¡Registro exitoso!');
                    form.reset();
                } else {
                    const error = await res.text();
                    alert('Error en el registro: ' + error);
                }
            } catch (err) {
                alert('Error de conexión');
                console.error(err);
            }
        });
    }

    // Login
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(loginForm);

            try {
                const res = await fetch('/auth/login', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    //const data = await res.json();
                    //alert('¡Inicio de sesión exitoso!');
                    // Aquí puedes redirigir al usuario o guardar el token, etc.
                   const data = await res.json();
                    if (data.auth) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('id_rol', data.id_rol);
                        localStorage.setItem('nombre', data.nombre);
                        localStorage.setItem('foto', data.foto);
                        alert('¡Inicio de sesión exitoso!');
                        window.location.href = '/';
                    } else {
                        alert('Error al iniciar sesión: ' + data.message);
                    } 
                } else {
                    const error = await res.text();
                    alert('Error al iniciar sesión: ' + error);
                }
            } catch (err) {
                alert('Error de conexión');
                console.error(err);
            }
        });
    }
});