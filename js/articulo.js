// Variables globales
let articulos = [];
let currentPage = 1;
const rowsPerPage = 8;
let totalRows = 0;
let sortColumn = null;
let sortDirection = 'asc';

// Registrar artículo
const form = document.getElementById('articuloForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const nombre_articulo = document.getElementById('nombre_articulo').value.trim();
    const detalles = document.getElementById('detalles').value.trim();

    const body = { nombre_articulo, detalles };

    try {
        const response = await fetch('/articulos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorData.error || "Error al registrar el artículo.",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Artículo registrado con éxito.",
        });

        form.reset();
        document.getElementById('verTablas').click();

    } catch (error) {
        console.error('Error al registrar el artículo:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al registrar el artículo. Intente más tarde.",
        });
    }
});

// Renderizar filas de la tabla con paginación y ordenamiento
function renderRows() {
    const tabla = document.getElementById('tablaArticulos');
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const rows = articulos.slice(start, end);
    rows.forEach((articulo, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${articulo.nombre_articulo}</td>
            <td>${articulo.detalles}</td>
            <td>
                <button class="btn btn-warning" onclick="editarArticulo(${articulo.id_articulo})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                <button class="btn btn-danger" onclick="eliminarArticulo(${articulo.id_articulo})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    document.getElementById('pageInfo').textContent = `${currentPage}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === Math.ceil(totalRows / rowsPerPage);
}

// Ordenar artículos por columna
function sortArticulos(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    articulos.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
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
        const response = await fetch('/articulos');
        if (!response.ok) throw new Error('Error al obtener los artículos.');
        articulos = await response.json();
        totalRows = articulos.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaArticulos').style.display = 'table';
    } catch (error) {
        console.error('Error al cargar los artículos:', error);
    }
});

// Buscar artículos por nombre
const buscarArticulo = async (nombre) => {
    try {
        const response = await fetch(`/articulos/nombre/${nombre}`);
        if (!response.ok) throw new Error('Error al buscar el artículo.');
        articulos = await response.json();
        totalRows = articulos.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaArticulos').style.display = 'table';
    } catch (error) {
        console.error('Error al buscar el artículo:', error);
        const tabla = document.getElementById('tablaArticulos');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="7">No se encontraron resultados</td></tr>';
    }
};

// Evento de búsqueda
document.getElementById('buscador').addEventListener('input', (event) => {
    const nombre = event.target.value.trim();
    if (nombre === '') {
        document.getElementById('verTablas').click();
    } else {
        buscarArticulo(nombre);
    }
});

// Encabezados ordenables
document.addEventListener('DOMContentLoaded', () => {
    const ths = document.querySelectorAll('#tablaArticulos thead th');
    const columns = [null, 'nombre_articulo', 'detalles'];
    ths.forEach((th, i) => {
        if (columns[i]) {
            th.style.cursor = 'pointer';
            th.onclick = () => sortArticulos(columns[i]);
        }
    });
});

// Editar artículo (abrir modal y cargar datos)
window.editarArticulo = async (id_articulo) => {
    try {
        const response = await fetch(`/articulos/${id_articulo}`);
        if (!response.ok) throw new Error('Error al obtener los datos del artículo.');
        const articulo = await response.json();
        document.getElementById('editar_id_articulo').value = articulo.id_articulo;
        document.getElementById('editar_nombre_articulo').value = articulo.nombre_articulo;
        document.getElementById('editar_detalles').value = articulo.detalles;
        document.getElementById('modalEditar').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar los datos del artículo:', error);
    }
};

// Eliminar artículo
window.eliminarArticulo = async (id_articulo) => {
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
            const response = await fetch(`/articulos/${id_articulo}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar el artículo.');
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "Artículo eliminado con éxito.",
            });
            document.getElementById('verTablas').click();
        } catch (error) {
            console.error('Error al eliminar el artículo:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al eliminar el artículo. Intente más tarde.",
            });
        }
    }
};

// Cerrar modal
document.getElementById('cerrarModal').addEventListener('click', () => {
    document.getElementById('modalEditar').style.display = 'none';
});

// Editar donacion (guardar cambios)
document.getElementById('editarForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validarFormulario(true)) return;

    const id_articulo = document.getElementById('editar_id_articulo').value;
    const nombre_articulo = document.getElementById('editar_nombre_articulo').value.trim();
    const detalles = document.getElementById('editar_detalles').value.trim();

    const body = {
        nombre_articulo,
        detalles
    };

    try {
        const response = await fetch(`/articulos/${id_articulo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Error al actualizar el artículo.');
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Artículo actualizado con éxito.",
        });
        document.getElementById('modalEditar').style.display = 'none';
        document.getElementById('verTablas').click();
    } catch (error) {
        console.error('Error al actualizar el artículo:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar el artículo. Intente más tarde.",
        });
    }
});

// Función para validar el formulario
const validarFormulario = (esEdicion = false ) => {
    const nombre = document.getElementById(esEdicion ? 'editar_nombre_articulo' : 'nombre_articulo').value.trim();
    const detalles = document.getElementById(esEdicion ? 'editar_detalles' : 'detalles').value.trim();

    // Validaciones con SweetAlert
    const nombreRegex = /^[a-zA-Z\s]+$/; // Solo permite letras y espacios
    // Validación del nombre, especie, eddad, descripción y foto.
    if (!nombre) {
        Swal.fire({
            icon: "error",
            title: "Campo requerido",
            text: "Por favor, ingresa un nombre.",
        });
        return false;
    }

    if (!nombreRegex.test(nombre)) {
        Swal.fire({
            icon: "error",
            title: "Nombre inválido",
            text: "El nombre solo puede contener letras y espacios.",
        });
        return false;
    }

    if (nombre.length < 3 || nombre.length > 25) {
        Swal.fire({
            icon: "error",
            title: "Longitud inválida",
            text: "El nombre debe tener entre 3 y 25 caractéres.",
        });
        return false;
    }

    if (!detalles) {
        Swal.fire({
            icon: "error",
            title: "Campo requerido",
            text: "Por favor, ingresa los detalles del artículo.",
        });
        return false;
    }
    if (detalles.length > 50) { //CAMBIAR EN BBDD EL TIPO DE DATO DE TEXT A VARCHAR(50)
        Swal.fire({
            icon: "error",
            title: "Descripción demasiado larga",
            text: "La descripción no puede exceder los 50 caracteres.",
        });
        return false;
    }
    return true;
};