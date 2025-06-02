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
        const select = document.getElementById('id_localidad');
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
        const selectGenero = document.getElementById('id_genero');
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
        const selectRol = document.getElementById('id_rol');
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
        const id_localidad = form.id_localidad.value;
        const id_genero = form.id_genero.value;
        const password = form.password.value;
       // const confirm_password = form.confirm_password.value;
        const id_rol = form.id_rol.value;
        const foto_usuario = form.foto_usuario.files[0];

        // Validar usando la función personalizada
        const campos = {
            nombre_apellido,
            email,
            password,
            //confirmar_password: confirm_password,
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

// Paginación
function updatePaginationButtons() {
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= Math.ceil(totalRows / rowsPerPage);
    document.getElementById('pageInfo').textContent = currentPage;
}

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
            <td>
                <button class="btn btn-warning" onclick="editarUsuario(${usuario.id_usuario})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                <button class="btn btn-danger" onclick="eliminarUsuario(${usuario.id_usuario})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updatePaginationButtons();
}

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

// Función para editar un usuario (abre el modal y carga los datos)
window.editarUsuario = async (id_usuario) => {
    try {
        // 1. Traer datos del usuario
        const response = await fetch(`/login/${id_usuario}`);
        if (!response.ok) throw new Error('Error al obtener los datos del usuario');
        const usuario = await response.json();

        // 2. Cargar datos básicos en el modal
        document.getElementById('editar_id_usuario').value = usuario.id_usuario;
        document.getElementById('editar_nombre_apellido').value = usuario.nombre_apellido;
        document.getElementById('editar_email').value = usuario.email;
        document.getElementById('password').value = '';
        //document.getElementById('editar_password').value = '';

        // 3. Mostrar la imagen actual
        const imgElement = document.getElementById('editar_imagen_preview');
        if (usuario.foto_usuario) {
            imgElement.src = `/uploads/usuario/${usuario.foto_usuario}`;
            imgElement.style.display = 'block';
        } else {
            imgElement.style.display = 'none';
        }

        // Cargar especies en el combobox del modal
        const localidadesResponse = await fetch('/login/localidades');
        if (!localidadesResponse.ok) throw new Error('Error al obtener las localidades');
        const localidades = await localidadesResponse.json();
        const selectLocalidad = document.getElementById('editar_localidad');
        selectLocalidad.innerHTML = '<option value="">Seleccione una localidad</option>';
        localidades.forEach(localidad => {
            const option = document.createElement('option');
            option.value = String(localidad.id_localidad);
            option.textContent = localidad.descripcion;
            selectLocalidad.appendChild(option);
        });
        // Selecciona la localidad del usuario
        selectLocalidad.value = String(usuario.id_localidad || '');

        // 5. Llenar y seleccionar género
        const genResponse = await fetch('/login/generos');
        const generos = await genResponse.json();
        const selectGenero = document.getElementById('editar_genero');
        selectGenero.innerHTML = '<option value="">Seleccione género</option>';
        generos.forEach(gen => {
            const option = document.createElement('option');
            option.value = String(gen.id_genero);
            option.textContent = gen.descripcion;
            selectGenero.appendChild(option);
        });
        selectGenero.value = String(usuario.id_genero || '');

        // 6. Llenar y seleccionar rol
        const rolResponse = await fetch('/login/roles');
        const roles = await rolResponse.json();
        const selectRol = document.getElementById('editar_rol');
        selectRol.innerHTML = '<option value="">Seleccione Rol</option>';
        roles.forEach(rol => {
            const option = document.createElement('option');
            option.value = String(rol.id_rol);
            option.textContent = rol.descripcion;
            selectRol.appendChild(option);
        });
        selectRol.value = String(usuario.id_rol || '');

        // 7. Mostrar el modal
        document.getElementById('modalEditar').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cargar el usuario."
        });
    }
};


// Eliminar usuario
window.eliminarUsuario = async (id_usuario) => {
    const confirmacion = await Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-secondary",
        },
    });
    if (confirmacion.isConfirmed) {
        try {
            const response = await fetch(`/login/${id_usuario}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar el usuario.');
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "Usuario eliminado con éxito.",
            });
            document.getElementById('verTablas').click();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al eliminar el usuario. Intente más tarde.",
            });
        }
    }
};

// Cerrar modal
document.getElementById('cerrarModal').addEventListener('click', () => {
    document.getElementById('modalEditar').style.display = 'none';
});

// Editar usuario (guardar cambios)
document.getElementById('editarForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id_usuario = document.getElementById('editar_id_usuario').value;
    const form = document.getElementById('editarForm');

    // Obtener los valores del formulario de edición
    const nombre_apellido = form.editar_nombre_apellido.value.trim();
    const email = form.editar_email.value.trim();
    const id_localidad = form.editar_localidad.value;
    const id_genero = form.editar_genero.value;
    const password = form.password.value;
    const id_rol = form.editar_rol.value;
    // const foto_usuario = form.editar_foto_usuario.files[0]; // Si necesitas validar imagen

    // Validar usando la función personalizada
    const campos = {
        nombre_apellido,
        email,
        password,
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
        // Asegúrate que el campo existe en el formulario
        const campo = form.querySelector(`[name="${validacion.campo}"]`) || form[validacion.campo];
        if (campo) campo.focus();
        return;
    }

    const formData = new FormData(form);

    try {
        const response = await fetch(`/login/${id_usuario}`, {
            method: 'PUT',
            body: formData,
        });
        if (!response.ok) throw new Error('Error al actualizar el usuario.');
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Usuario actualizado con éxito.",
        });
        document.getElementById('modalEditar').style.display = 'none';
        document.getElementById('verTablas').click();
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar el usuario. Intente más tarde.",
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
    /*
    if (campos.password !== campos.confirmar_password) {
        return { valido: false, mensaje: 'Las contraseñas no coinciden.', campo: 'confirm_password' };
    }
    */
    if (!campos.localidad || campos.localidad === '' || campos.localidad === '0') {
        return { valido: false, mensaje: 'Debe seleccionar una localidad.', campo: 'id_localidad' };
    }

    if (!campos.genero) {
        return { valido: false, mensaje: 'Debe seleccionar un género.', campo: 'id_genero' };
    }

    if (!campos.rol || campos.rol === '' || campos.rol === '0') {
        return { valido: false, mensaje: 'Debe seleccionar un rol.', campo: 'id_rol' };
    }

        for (let key in campos) {
        if (!campos[key] || campos[key].trim() === '') {
            return { valido: false, mensaje: 'Todos los campos son obligatorios.', campo: key };
        }
    }

    return { valido: true };
}