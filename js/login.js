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

    // --- REGISTRO ---
    const form = document.getElementById('form-registro');
    if (form) {
        form.addEventListener('submit', async function(e) {
            // Obtener los valores de los campos
            const campos = {
                nombre_apellido: form.querySelector('[name="nombre_apellido"]').value,
                email: form.querySelector('[name="email"]').value,
                password: form.querySelector('[name="password"]').value,
                confirmar_password: form.querySelector('[name="confirm_password"]').value,
                localidad: form.querySelector('[name="id_localidad"]').value,
                genero: form.querySelector('[name="id_genero"]:checked') ? form.querySelector('[name="id_genero"]:checked').value : ''
            };

            // Validación
            const resultado = validarRegistro(campos, form);
            if (!resultado.valido) {
                e.preventDefault();
                Swal.fire({
                    icon: 'error',
                    title: 'Error de validación',
                    text: resultado.mensaje
                });
                return;
            }

            e.preventDefault(); // Evitamos el envío por defecto para usar fetch

            const formData = new FormData(form);

            try {
                const res = await fetch('/auth/registro', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();

                if (data.success === false && data.existe) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Correo ya registrado',
                        text: data.message
                    });
                    return;
                }

                if (res.ok && data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Registro exitoso!',
                        text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.'
                    });
                    form.reset();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error en el registro',
                        text: data.message || 'Ocurrió un error inesperado.'
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor.'
                });
                console.error(err);
            }
        });
    }

    // --- LOGIN ---
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = loginForm.querySelector('[name="email"]');
            const passwordInput = loginForm.querySelector('[name="password"]');
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email) || email.includes(' ')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de validación',
                    text: 'Ingrese un email válido y sin espacios.'
                });
                return;
            }

            // Validación de contraseña
            if (!password || password.length > 10) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de validación',
                    text: 'La contraseña no puede estar vacía y debe tener hasta 10 caracteres.'
                });
                return;
            }

            const formData = new FormData(loginForm);

            try {
                const res = await fetch('/auth/login', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();

                if (res.ok && data.auth) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('id_rol', data.id_rol);
                    localStorage.setItem('nombre', data.nombre);
                    localStorage.setItem('foto', data.foto);
                    Swal.fire({
                        icon: 'success',
                        title: '¡Inicio de sesión exitoso!',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = '/';
                    });
                } else {
                    let mensaje = data.message || 'Ocurrió un error inesperado.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al iniciar sesión',
                        text: mensaje
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor.'
                });
                console.error(err);
            }
        });
    }
});

// Función de validación para registro
function validarRegistro(campos, form) {
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,15}$/;
    if (!campos.nombre_apellido || !soloLetras.test(campos.nombre_apellido.trim())) {
        return { valido: false, mensaje: 'El nombre y apellido solo puede contener letras y espacios, y hasta 15 caracteres.', campo: 'nombre_apellido' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!campos.email || !emailRegex.test(campos.email) || campos.email.includes(' ')) {
        return { valido: false, mensaje: 'Ingrese un email válido y sin espacios.', campo: 'email' };
    }

    if (!campos.password || campos.password.length > 10) {
        return { valido: false, mensaje: 'La contraseña no puede estar vacía y debe tener hasta 10 caracteres.', campo: 'password' };
    }

    if (campos.password !== campos.confirmar_password) {
        return { valido: false, mensaje: 'Las contraseñas no coinciden.', campo: 'confirm_password' };
    }

    if (!campos.localidad || campos.localidad === '' || campos.localidad === '0') {
        return { valido: false, mensaje: 'Debe seleccionar una localidad.', campo: 'id_localidad' };
    }

    if (!campos.genero) {
        return { valido: false, mensaje: 'Debe seleccionar un género.', campo: 'id_genero' };
    }

    for (let key in campos) {
        if (!campos[key] || campos[key].trim() === '') {
            return { valido: false, mensaje: 'Todos los campos son obligatorios.', campo: key };
        }
    }

    return { valido: true };
}