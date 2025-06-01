let usuarios = [];
let currentPage = 1;
const rowsPerPage = 5;
let totalRows = 0;

document.addEventListener('DOMContentLoaded', async () => {
    // Llenar el select de localidades
    try {
        const response = await fetch('/login/localidades');
        if (!response.ok) throw new Error('Error al obtener localidades');
        const localidades = await response.json();
        const select = document.getElementById('localidad');
        localidades.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.id_localidad;
            option.textContent = loc.descripcion;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar localidades:', error);
    }

    // Llenar el select de géneros
    try {
        const response = await fetch('/login/generos');
        if (!response.ok) throw new Error('Error al obtener géneros');
        const generos = await response.json();
        const selectGenero = document.getElementById('genero');
        generos.forEach(gen => {
            const option = document.createElement('option');
            option.value = gen.id_genero;
            option.textContent = gen.descripcion;
            selectGenero.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar géneros:', error);
    }

    // Llenar el select de roles
    try {
        const response = await fetch('/login/roles');
        if (!response.ok) throw new Error('Error al obtener roles');
        const roles = await response.json();
        const selectRol = document.getElementById('rol');
        roles.forEach(rol => {
            const option = document.createElement('option');
            option.value = rol.id_rol;
            option.textContent = rol.descripcion;
            selectRol.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar roles:', error);
    }

    // Registrar usuario (con imagen, usando FormData)
    const form = document.getElementById('usuarioForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Obtener los valores del formulario
        const nombre_apellido = form.nombre_apellido.value.trim();
        const email = form.email.value.trim();
        const id_localidad = form.localidad.value;
        const id_genero = form.genero.value;
        const password = form.password.value;
        const confirm_password = form.confirm_password.value;
        const id_rol = form.rol.value;
        const foto_usuario = form.foto_usuario.files[0];

        // Validar usando la función personalizada
        const campos = {
            nombre_apellido,
            email,
            password,
            confirmar_password: confirm_password,
            localidad: id_localidad,
            genero: id_genero,
            rol: id_rol
        };

        const validacion = validarRegistro(campos, form);
        if (!validacion.valido) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: validacion.mensaje
            });
            form[validacion.campo]?.focus();
            return;
        }

        // Usar FormData para enviar la imagen
        const formData = new FormData();
        formData.append('nombre_apellido', nombre_apellido);
        formData.append('email', email);
        formData.append('id_localidad', id_localidad);
        formData.append('id_genero', id_genero);
        formData.append('password', password);
        formData.append('id_rol', id_rol);
        if (foto_usuario) {
            formData.append('foto_usuario', foto_usuario);
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "¡Usuario registrado correctamente!",
                });
                form.reset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.error || 'Error al registrar el usuario.'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al registrar el usuario.'
            });
        }
    });
});

function renderRows() {
    const tbody = document.querySelector('#tablaUsuarios tbody');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageUsuarios = usuarios.slice(start, end);

    pageUsuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.nombre_apellido}</td>
            <td>${usuario.email}</td>
            <td>${usuario.localidad || ''}</td>
            <td>${usuario.genero || ''}</td>
            <td>********</td>
            <td>
                ${usuario.foto_usuario 
                    ? `<img src="/uploads/usuario/${usuario.foto_usuario}" alt="Foto" style="width:40px;height:40px;object-fit:cover;border-radius:50%;">`
                    : ''}
            </td>
            <td></td>
        `;
        tbody.appendChild(tr);
    });
}

// Paginación
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderRows();
    }
});
document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < Math.ceil(totalRows / rowsPerPage)) {
        currentPage++;
        renderRows();
    }
});

    // Mostrar tabla de usuarios al hacer click en "Ver Tablas"
document.getElementById('verTablas').addEventListener('click', async () => {
    try {
        const response = await fetch('/login/usuario');
        if (!response.ok) throw new Error('Error al obtener usuarios');
        usuarios = await response.json();
        totalRows = usuarios.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaUsuarios').style.display = 'table';
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
});

// Función de validación para registro
function validarRegistro(campos, form) {
    for (let key in campos) {
        if (!campos[key] || campos[key].trim() === '') {
            return { valido: false, mensaje: 'Todos los campos son obligatorios.', campo: key };
        }
    }

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

    if (!campos.rol || campos.rol === '' || campos.rol === '0') {
        return { valido: false, mensaje: 'Debe seleccionar un rol.', campo: 'id_rol' };
    }

    return { valido: true };
}