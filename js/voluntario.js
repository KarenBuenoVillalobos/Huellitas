// Llenar el combobox de asignaciones
const loadAsignaciones = async () => {
    try {
        const response = await fetch('/voluntarios/asignaciones'); // Endpoint para obtener las especies
        if (!response.ok) {
            throw new Error('Error al obtener las asignaciones.');
        }
        const asignaciones = await response.json();

        const selectAsignacion = document.getElementById('id_asignacion');
        asignaciones.forEach(asignacion => {
            const option = document.createElement('option');
            option.value = asignacion.id_asignacion;
            option.textContent = asignacion.nombre_asignacion;
            selectAsignacion.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las asignaciones:', error);
    }
};

document.addEventListener('DOMContentLoaded', loadAsignaciones);

// Manejar el envío del formulario
const form = document.getElementById('voluntarioForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Llamar a la función de validación
    if (!validarFormulario()) {
        return; // Detener el envío si hay errores
    }

    const formData = new FormData(form);

    try {
        const response = await fetch('/voluntarios', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorData.error || "Error al registrar el voluntario.",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Voluntario registrado con éxito.",
        });

        form.reset();

    } catch (error) {
        console.error('Error al registrar el voluntario:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al registrar el voluntario. Intente más tarde.",
        });
    }
});

// Manejar el botón "Ver Tablas"
const verTablasButton = document.getElementById('verTablas');
verTablasButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/voluntarios'); // Endpoint para obtener los animales
        if (!response.ok) {
            throw new Error('Error al obtener los voluntarios.');
        }
        const voluntarios = await response.json();

        const tabla = document.getElementById('tablaVoluntarios');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        //corregir esto
        voluntarios.forEach(voluntario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${voluntario.id_voluntario}</td>
                <td>${voluntario.email}</td>
                <td>${voluntario.nombre_asignacion}</td>
                <td>${voluntario.tarea}</td>
                <td>
                    <button class="btn btn-warning" onclick="editarVoluntario(${voluntario.id_voluntario})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                    <button class="btn btn-danger" onclick="eliminarVoluntario(${voluntario.id_voluntario})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
                </td>
            `;
            tbody.appendChild(row);
        });

        tabla.style.display = 'table'; // Mostrar la tabla
    } catch (error) {
        console.error('Error al cargar los voluntarios:', error);
    }
});
// Manejar el envío del formulario de edición
const editarForm = document.getElementById('editarForm');
editarForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Llamar a la función de validación con el parámetro esEdicion = true
    if (!validarFormulario(true)) {
        return; // Detener el envío si hay errores
    }

    const id_voluntario = document.getElementById('editar_id_voluntario').value;
    const formData = new FormData(editarForm);

    try {
        const response = await fetch(`/voluntarios/${id_voluntario}`, {
            method: 'PUT',
            body: formData, // Enviar los datos como FormData para incluir la imagen
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el voluntario.');
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Voluntario actualizado con éxito.",
        });

        document.getElementById('modalEditar').style.display = 'none'; // Cerrar el modal
        verTablasButton.click(); // Recargar la tabla
    } catch (error) {
        console.error('Error al actualizar el voluntario:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar el voluntario. Intente más tarde.",
        });
    }
});

// Manejar el cierre del modal
document.getElementById('cerrarModal').addEventListener('click', () => {
    document.getElementById('modalEditar').style.display = 'none';
});

// Función para buscar voluntarios por nombre
const buscarVoluntario = async (nombre) => {
    try {
        const response = await fetch(`/voluntarios/nombre/${nombre}`);
        if (!response.ok) {
            throw new Error('Error al buscar el voluntario.');
        }
        const voluntarios = await response.json();

        // Actualizar la tabla con los resultados
        const tabla = document.getElementById('tablaVoluntarios');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        //Podria optimizarse con un map
        // Llenar la tabla con los resultados con tiempo lo mejoro
        voluntarios.forEach(voluntario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${voluntario.id_voluntario}</td>
                <td>${voluntario.email}</td>
                <td>${voluntario.nombre_asignacion}</td>
                <td>${voluntario.tarea}</td>
                <td>
                <button class="btn btn-warning" onclick="editarVoluntario(${voluntario.id_voluntario})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                <button class="btn btn-danger" onclick="eliminarVoluntario(${voluntario.id_voluntario})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
                </td>
            `;
            tbody.appendChild(row);
        });

        tabla.style.display = 'table'; // Mostrar la tabla
    } catch (error) {
        console.error('Error al buscar el voluntario:', error);
        const tabla = document.getElementById('tablaVoluntarios');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="7">No se encontraron resultados.</td></tr>';
    }
};

// Manejar el evento de búsqueda
const buscador = document.getElementById('buscador');
buscador.addEventListener('input', (event) => {
    const nombre = event.target.value.trim();
    if (nombre === '') {
        verTablasButton.click(); // Mostrar todos los animales si el buscador está vacío
    } else {
        buscarVoluntario(nombre); // Buscar coincidencias
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.getElementById('tablaVoluntarios');
    const tbody = tabla.querySelector('tbody');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const verTablasButton = document.getElementById('verTablas');

    let currentPage = 1;
    const rowsPerPage = 8;
    let totalRows = 0;
    let voluntarios = []; // Variable global para almacenar los datos

    // Función para renderizar filas
    function renderRows() {
        tbody.innerHTML = ''; // Limpia las filas existentes
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const rows = voluntarios.slice(start, end); // Obtiene solo las filas de la página actual

        rows.forEach(voluntario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${voluntario.id_voluntario}</td>
                <td>${voluntario.email}</td>
                <td>${voluntario.nombre_asignacion}</td>
                <td>${voluntario.tarea}</td>
                <td>
                    <button class="btn btn-warning" onclick="editarVoluntario(${voluntario.id_voluntario})">Editar</button>
                    <button class="btn btn-danger" onclick="eliminarVoluntario(${voluntario.id_voluntario})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Actualiza la información de la página
        pageInfo.textContent = `${currentPage}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === Math.ceil(totalRows / rowsPerPage);
    }

    // Eventos para las flechas
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderRows();
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(totalRows / rowsPerPage)) {
            currentPage++;
            renderRows();
        }
    });

    // Manejar el botón "Ver Tablas"
    verTablasButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/voluntarios'); // Endpoint para obtener los animales
            if (!response.ok) {
                throw new Error('Error al obtener los voluntarios.');
            }
            voluntarios = await response.json(); // Guarda los datos en la variable global
            totalRows = voluntarios.length; // Actualiza el total de filas

            currentPage = 1; // Reinicia a la primera página
            renderRows(); // Renderiza las filas de la primera página
            tabla.style.display = 'table'; // Muestra la tabla
        } catch (error) {
            console.error('Error al cargar los voluntarios:', error);
        }
    });

    // Renderiza la primera página al cargar (opcional, si quieres mostrar datos simulados)
    renderRows();
});

// Función para editar un voluntario (abre el modal y carga los datos)
const editarVoluntario = async (id_voluntario) => {
    try {
        const response = await fetch(`/voluntarios/${id_voluntario}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del voluntario.');
        }
        const voluntario = await response.json();

        // Llenar el formulario del modal con los datos del voluntario
        document.getElementById('editar_id_voluntario').value = voluntario.id_voluntario;
        document.getElementById('editar_email').value = voluntario.email;
        document.getElementById('editar_nombre_asignacion').value = voluntario.nombre_asignacion;
        document.getElementById('editar_tarea').value = voluntario.tarea;

        // Cargar las especies en el combobox del modal
        const asignacionesResponse = await fetch('/voluntarios/asignaciones');
        if (!asignacionesResponse.ok) {
            throw new Error('Error al obtener las asignaciones.');
        }
        const asignaciones = await asignacionesResponse.json();
        const selectAsignacion = document.getElementById('editar_id_asignacion');
        selectAsignacion.innerHTML = ''; // Limpiar el contenido del select
        asignaciones.forEach(asignacion => {
            const option = document.createElement('option');
            option.value = asignacion.id_asignacion;
            option.textContent = asignacion.nombre_asignacion;
            if (asignacion.id_asignacion === asignacion.id_asignacion) {
                option.selected = true;
            }
            selectAsignacion.appendChild(option);
        });

        // Mostrar el modal
        document.getElementById('modalEditar').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar los datos del voluntario:', error);
    }
};

// Función para eliminar un voluntario
const eliminarVoluntario = async (id_voluntario) => {
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
            const response = await fetch(`/voluntarios/${id_voluntario}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el voluntario.');
            }

            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "Voluntario eliminado con éxito.",
            });

            verTablasButton.click(); // Recargar la tabla
        } catch (error) {
            console.error('Error al eliminar el voluntario:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al eliminar el voluntario. Intente más tarde.",
            });
        }
    }
};

// Función para validar el formulario
const validarFormulario = (esEdicion = false ) => {
    // const nombre = document.getElementById(esEdicion ? 'editar_nombre_animal' : 'nombre_animal').value.trim();
    const email = document.getElementById(esEdicion ? 'editar_email' : 'email').value.trim();
    const asignacion = document.getElementById(esEdicion ? 'editar_id_asignacion' : 'id_asignacion').value;
    const tarea = document.getElementById(esEdicion ? 'editar_tarea' : 'tarea').value.trim();

    // Validaciones con SweetAlert
    const nombreRegex = /^[a-zA-Z\s]+$/; // Solo permite letras y espacios
    // Validación del nombre, especie, eddad, descripción y foto.
    if (!email) {
        Swal.fire({
            icon: "error",
            title: "Campo requerido",
            text: "Por favor, ingresa un correo electrónico.",
        });
        return false;
    }

    if (email.length < 10 || email.length > 30) {
        Swal.fire({
            icon: "error",
            title: "Longitud inválida",
            text: "El email debe tener entre 10 y 30 caractéres.",
        });
        return false;
    }

    if (!asignacion || asignacion === "") {
        Swal.fire({
            icon: "error",
            title: "Campo requerido",
            text: "Por favor, selecciona la asignación.",
        });
        return false;
    }

    if (!tarea) {
        Swal.fire({
            icon: "error",
            title: "Campo requerido",
            text: "Por favor, ingresa la tarea a realizar.",
        });
        return false;
    }
    if (tarea.length > 50) {
        Swal.fire({
            icon: "error",
            title: "Tarea demasiado larga",
            text: "La tarea no puede exceder los 50 caractéres.",
        });
        return false;
    }
    return true;
};