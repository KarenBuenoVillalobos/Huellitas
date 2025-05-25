// Variables globales
let donaciones = [];
let currentPage = 1;
const rowsPerPage = 8;
let totalRows = 0;
let sortColumn = null;
let sortDirection = 'asc';

// Cargar especies en el select
const loadArticulos = async () => {
    try {
        const response = await fetch('/donaciones/articulos');
        if (!response.ok) throw new Error('Error al obtener los artículos.');
        const articulos = await response.json();

        const selectArticulo = document.getElementById('id_articulo');
        articulos.forEach(articulo => {
            const option = document.createElement('option');
            option.value = articulo.id_articulo;
            option.textContent = articulo.nombre_articulo;
            selectArticulo.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los artículos:', error);
    }
};

document.addEventListener('DOMContentLoaded', loadArticulos);

// Registrar donacion
const form = document.getElementById('donacionForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validarFormulario()) return;
    const formData = new FormData(form);

    try {
        const response = await fetch('/donaciones', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorData.error || "Error al registrar la donación.",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Donación registrada con éxito.",
        });

        form.reset();
        document.getElementById('verTablas').click(); // Recarga la tabla
    } catch (error) {
        console.error('Error al registrar la donación:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al registrar la donación. Intente más tarde.",
        });
    }
});

// Renderizar filas de la tabla con paginación y ordenamiento CAMBIAR A NOMBRE_DONADOR, NO TRAER NOMBRE DE USUARIO
function renderRows() {
    const tabla = document.getElementById('tablaDonaciones');
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const rows = donaciones.slice(start, end);
    rows.forEach((donacion, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${donacion.nombre_donador}</td>
            <td>${donacion.nombre_articulo || donacion.articulo}</td>
            <td>${donacion.fecha_donacion}</td>
            <td>
                <button class="btn btn-warning" onclick="editarDonacion(${donacion.id_donacion})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                <button class="btn btn-danger" onclick="eliminarDonacion(${donacion.id_donacion})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    // Actualiza la información de la página
    document.getElementById('pageInfo').textContent = `${currentPage}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === Math.ceil(totalRows / rowsPerPage);
}

// Ordenar donaciones por columna
function sortDonaciones(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    donaciones.sort((a, b) => {
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
        const response = await fetch('/donaciones');
        if (!response.ok) throw new Error('Error al obtener las donaciones.');
        donaciones = await response.json();
        totalRows = donaciones.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaDonaciones').style.display = 'table';
    } catch (error) {
        console.error('Error al cargar las donaciones:', error);
    }
});

// Buscar donaciones por donador (nombre)
const buscarDonador = async (nombre) => {
    try {
        const response = await fetch(`/donaciones/nombre/${nombre}`);
        if (!response.ok) throw new Error('Error al buscar el donador.');
        donaciones = await response.json();
        totalRows = donaciones.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaDonaciones').style.display = 'table';
    } catch (error) {
        console.error('Error al buscar el donador:', error);
        const tabla = document.getElementById('tablaDonaciones');
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
        buscarDonador(nombre);
    }
});

// Encabezados ordenables
document.addEventListener('DOMContentLoaded', () => {
    const ths = document.querySelectorAll('#tablaDonaciones thead th');
    // El primer th es el incremental, los siguientes son los campos reales
    const columns = [null, 'nombre_donador', 'nombre_articulo'];  // CAMBIAR ESTO SEGUN COLUMNAS
    ths.forEach((th, i) => {
        if (columns[i]) {
            th.style.cursor = 'pointer';
            th.onclick = () => sortDonaciones(columns[i]);
        }
    });
    // Inicializar el primer ordenamiento
});

// Función para editar un donador (abre el modal y carga los datos)
window.editarDonacion = async (id_donacion) => {
    try {
        const response = await fetch(`/donaciones/${id_donacion}`);
        if (!response.ok) throw new Error('Error al obtener los datos del donador.');
        const donacion = await response.json();
        // Cargar datos en el modal
        document.getElementById('editar_id_donacion').value = donacion.id_donacion;
        document.getElementById('editar_nombre_donador').value = donacion.nombre_donador;
        // document.getElementById('editar_nombre_articulo').value = donacion.nombre_articulo;
        document.getElementById('editar_fecha_donacion').value = donacion.fecha_donacion;

        // Cargar articulos en el combobox del modal ARTICULOS
        const articulosResponse = await fetch('/donaciones/articulos');
        if (!articulosResponse.ok) throw new Error('Error al obtener los artículos.');
        const articulos = await articulosResponse.json();
        const selectArticulo = document.getElementById('editar_id_articulo');
        selectArticulo.innerHTML = '';
        articulos.forEach(articulo => {
            const option = document.createElement('option');
            option.value = articulo.id_articulo;
            option.textContent = articulo.nombre_articulo;
            if (articulo.id_articulo === donacion.id_articulo) option.selected = true;
            selectArticulo.appendChild(option);
        });

        // Mostrar el modal
        document.getElementById('modalEditar').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar los datos del donador:', error);
    }
};

// Eliminar donacion
window.eliminarDonacion = async (id_donacion) => {
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
            const response = await fetch(`/donaciones/${id_donacion}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar la donación.');
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "Donación eliminada con éxito.",
            });
            document.getElementById('verTablas').click();
        } catch (error) {
            console.error('Error al eliminar la donación:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al eliminar la donación. Intente más tarde.",
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
    const id_donacion = document.getElementById('editar_id_donacion').value;
    const formData = new FormData(document.getElementById('editarForm'));
    try {
        const response = await fetch(`/donaciones/${id_donacion}`, {
            method: 'PUT',
            body: formData,
        });
        if (!response.ok) throw new Error('Error al actualizar la donación.');
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Donación actualizada con éxito.",
        });
        document.getElementById('modalEditar').style.display = 'none';
        document.getElementById('verTablas').click();
    } catch (error) {
        console.error('Error al actualizar la donación:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar la donación. Intente más tarde.",
        });
    }
});

// Validación de formulario  REVISAR CUALES ME SIRVEN
function validarFormulario(esEdicion = false) {
    const nombre = document.getElementById(esEdicion ? 'editar_nombre_donador' : 'nombre_donador').value.trim();
    const articulo = document.getElementById(esEdicion ? 'editar_id_articulo' : 'id_articulo').value;
    const fecha_donacion = document.getElementById(esEdicion ? 'editar_fecha_donacion' : 'fecha_donacion').value.trim();
    // Validaciones
    const nombreRegex = /^[a-zA-Z\s]+$/;
    if (!nombre) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "El nombre no puede estar en blanco." });
        return false;
    }

    if (!nombreRegex.test(nombre)) {
        Swal.fire({ icon: "error", title: "Nombre inválido", text: "El nombre solo puede contener letras y espacios." });
        return false;
    }

    if (nombre.length < 3 || nombre.length > 30) {
        Swal.fire({ icon: "error", title: "Longitud inválida", text: "El nombre debe tener entre 3 y 30 caracteres." });
        return false;
    }

    if (!articulo || articulo === "") {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, selecciona un artículo." });
        return false;
    }

    if (!fecha_donacion) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, ingresa una fecha." });
        return false;
    }

    const hoy = new Date();
    const fechaIngresada = new Date(fecha_donacion);
    if (fechaIngresada > hoy) {
        Swal.fire({ icon: "error", title: "Fecha inválida", text: "La fecha no puede ser futura." });
        return false;
    }

    const fechaMinima = new Date('2024-01-01');
    if (fechaIngresada < fechaMinima) {
        Swal.fire({ icon: "error", title: "Fecha inválida", text: "La fecha no puede ser anterior al año 2024." });
        return false;
    }

    return true;
}