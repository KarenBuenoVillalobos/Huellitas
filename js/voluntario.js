// Variables globales
let voluntarios = [];
let currentPage = 1;
const rowsPerPage = 8;
let totalRows = 0;
let sortColumn = null;
let sortDirection = 'asc';

// Cargar asignaciones en el select
const loadAsignaciones = async () => {
    try {
        const response = await fetch('/voluntarios/asignaciones');
        if (!response.ok) throw new Error('Error al obtener las asignaciones');
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

// Registrar voluntario
const form = document.getElementById('voluntarioForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validarFormulario()) return;

    const email = document.getElementById('email').value.trim();
    const id_asignacion = document.getElementById('id_asignacion').value;
    const tarea = document.getElementById('tarea').value.trim();

    const body = { email, id_asignacion, tarea };

    try {
        const response = await fetch('/voluntarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
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
        document.getElementById('verTablas').click();
    } catch (error) {
        console.error('Error al registrar el voluntario:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al registrar el voluntario. Intente más tarde.",
        });
    }
});

// Renderizar filas de la tabla con paginación y ordenamiento
function renderRows() {
    const tabla = document.getElementById('tablaVoluntarios');
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const rows = voluntarios.slice(start, end);
    rows.forEach((voluntario, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${voluntario.email}</td>
            <td>${voluntario.nombre_asignacion || voluntario.asignacion}</td>
            <td>${voluntario.tarea}</td>
            <td>
                <button class="btn btn-warning" onclick="editarVoluntario(${voluntario.id_voluntario})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                <button class="btn btn-danger" onclick="eliminarVoluntario(${voluntario.id_voluntario})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    // Actualiza la información de la página
    document.getElementById('pageInfo').textContent = `${currentPage}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === Math.ceil(totalRows / rowsPerPage);
}

// Ordenar voluntarios por columna
function sortVoluntarios(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    voluntarios.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        // Si es string, compara insensible a mayúsculas/minúsculas
        if (typeof valA === 'string' && typeof valB === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    currentPage = 1;
    renderRows();
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

// Botón "Ver Tablas"
document.getElementById('verTablas').addEventListener('click', async () => {
    try {
        const response = await fetch('/voluntarios');
        if (!response.ok) throw new Error('Error al obtener los voluntarios.');
        voluntarios = await response.json();
        totalRows = voluntarios.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaVoluntarios').style.display = 'table';
    } catch (error) {
        console.error('Error al cargar los voluntarios:', error);
    }
});

// Buscar voluntarios por asignación
const buscarVoluntario = async (asignacion) => {
    try {
        const response = await fetch(`/voluntarios/asignacion/${asignacion}`);
        if (!response.ok) throw new Error('Error al buscar el voluntario.');
        voluntarios = await response.json();
        totalRows = voluntarios.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaVoluntarios').style.display = 'table';
    } catch (error) {
        console.error('Error al buscar el voluntario:', error);
        const tabla = document.getElementById('tablaVoluntarios');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="7">No se encontraron resultados</td></tr>';
    }
};

// Evento de búsqueda SOLO por asignación
document.getElementById('buscador').addEventListener('input', (event) => {
    const asignacion = event.target.value.trim();
    if (asignacion === '') {
        document.getElementById('verTablas').click();
    } else {
        buscarVoluntario(asignacion);
    }
});

// Encabezados ordenables
document.addEventListener('DOMContentLoaded', () => {
    const ths = document.querySelectorAll('#tablaVoluntarios thead th');
    // El primer th es el incremental, los siguientes son los campos reales
    const columns = [null, 'email', 'asignacion', 'tarea'];
    ths.forEach((th, i) => {
        if (columns[i]) {
            th.style.cursor = 'pointer';
            th.onclick = () => sortVoluntarios(columns[i]);
        }
    });
    // Inicializar el primer ordenamiento
});

// Función para editar un voluntario (abre el modal y carga los datos)
window.editarVoluntario = async (id_voluntario) => {
    try {
        const response = await fetch(`/voluntarios/${id_voluntario}`);
        if (!response.ok) throw new Error('Error al obtener los datos del voluntario.');
        const voluntario = await response.json();
        // Cargar datos en el modal
        document.getElementById('editar_id_voluntario').value = voluntario.id_voluntario;
        document.getElementById('editar_email').value = voluntario.email;
        document.getElementById('editar_tarea').value = voluntario.tarea;

        // Cargar asignacion en el combobox del modal
        const asignacionResponse = await fetch('/voluntarios/asignaciones');
        if (!asignacionResponse.ok) throw new Error('Error al obtener las asignaciones');
        const asignaciones = await asignacionResponse.json();
        const selectAsignacion = document.getElementById('editar_id_asignacion');
        selectAsignacion.innerHTML = '';
        asignaciones.forEach(asignacion => {
            const option = document.createElement('option');
            option.value = asignacion.id_asignacion;
            option.textContent = asignacion.nombre_asignacion;
            if (asignacion.id_asignacion === voluntario.id_asignacion) option.selected = true;
            selectAsignacion.appendChild(option);
        });

        // Mostrar el modal
        document.getElementById('modalEditar').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar los datos del voluntario:', error);
    }
};

// Eliminar voluntario
window.eliminarVoluntario = async (id_voluntario) => {
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
    // Si el usuario confirma la eliminación
    if (confirmacion.isConfirmed) {
        try {
            const response = await fetch(`/voluntarios/${id_voluntario}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar el voluntario.');
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "Voluntario eliminado con éxito.",
            });
            document.getElementById('verTablas').click();
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

// Cerrar modal
document.getElementById('cerrarModal').addEventListener('click', () => {
    document.getElementById('modalEditar').style.display = 'none';
});

// Editar voluntario (guardar cambios)
document.getElementById('editarForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validarFormulario(true)) return;

    const id_voluntario = document.getElementById('editar_id_voluntario').value;
    const email = document.getElementById('editar_email').value.trim();
    const id_asignacion = document.getElementById('editar_id_asignacion').value;
    const tarea = document.getElementById('editar_tarea').value.trim();

    const body = { email, id_asignacion, tarea };

    try {
        const response = await fetch(`/voluntarios/${id_voluntario}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Error al actualizar el voluntario.');
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Voluntario actualizado con éxito.",
        });
        document.getElementById('modalEditar').style.display = 'none';
        document.getElementById('verTablas').click();
    } catch (error) {
        console.error('Error al actualizar el voluntario:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar el voluntario. Intente más tarde.",
        });
    }
});

// Validación de formulario
function validarFormulario(esEdicion = false) {
    const email = document.getElementById(esEdicion ? 'editar_email' : 'email').value.trim();
    const asignacion = document.getElementById(esEdicion ? 'editar_id_asignacion' : 'id_asignacion').value;
    const tarea = document.getElementById(esEdicion ? 'editar_tarea' : 'tarea').value.trim();
    // Validaciones

    if (!email) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "El email no puede estar en blanco." });
        return false;
    }

    if (email.length < 10 || email.length > 30) {
        Swal.fire({ icon: "error", title: "Longitud inválida", text: "El email debe tener entre 10 y 30 caracteres." });
        return false;
    }

    if (!asignacion || asignacion === "") {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, selecciona una asignación." });
        return false;
    }

    if (!tarea) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, ingresa una descripción de la tarea." });
        return false;
    }
    if (tarea.length > 80) {
        Swal.fire({ icon: "error", title: "Descripción demasiado larga", text: "La descripción de la tarea no puede exceder los 50 caracteres." });
        return false;
    }
    return true;
}