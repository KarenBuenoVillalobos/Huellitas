// Manejar el envío del formulario
const form = document.getElementById('articuloForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Llamar a la función de validación
    if (!validarFormulario()) {
        return; // Detener el envío si hay errores
    }

    const formData = new FormData(form);
    // for (let [key, value] of formData.entries()) {
    // console.log(`${key}: ${value}`);
    // }

    try {
        const response = await fetch('/articulos', {
            method: 'POST',
            body: formData
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

    } catch (error) {
        console.error('Error al registrar el artículo:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al registrar el artículo. Intente más tarde.",
        });
    }
});

// Manejar el botón "Ver Tablas"
const verTablasButton = document.getElementById('verTablas');
verTablasButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/articulos'); // Endpoint para obtener los artículos
        if (!response.ok) {
            throw new Error('Error al obtener los articulos');
        }
        const articulos = await response.json();

        const tabla = document.getElementById('tablaArticulos');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        //corregir esto
        articulos.forEach(articulo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${articulo.id_articulo}</td>
                <td>${articulo.nombre_articulo}</td>
                <td>${articulo.detalles}</td>
                <td>
                    <button class="btn btn-warning" onclick="editarArticulo(${articulo.id_articulo})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                    <button class="btn btn-danger" onclick="eliminarArticulo(${articulo.id_articulo})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
                </td>
            `;
            tbody.appendChild(row);
        });

        tabla.style.display = 'table'; // Mostrar la tabla
    } catch (error) {
        console.error('Error al cargar los artículos:', error);
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

    const id_articulo = document.getElementById('editar_id_articulo').value;
    const formData = new FormData(editarForm);

    try {
        const response = await fetch(`/articulos/${id_articulo}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el articulo');
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Artículo actualizado con éxito.",
        });

        document.getElementById('modalEditar').style.display = 'none'; // Cerrar el modal
        verTablasButton.click(); // Recargar la tabla
    } catch (error) {
        console.error('Error al actualizar el artículo:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar el artículo. Intente más tarde.",
        });
    }
});

// Manejar el cierre del modal
document.getElementById('cerrarModal').addEventListener('click', () => {
    document.getElementById('modalEditar').style.display = 'none';
});

// Función para buscar artículos por nombre
const buscarArticulo = async (nombre) => {
    try {
        const response = await fetch(`/articulos/nombre/${nombre}`);
        if (!response.ok) {
            throw new Error('Error al buscar el artículo.');
        }
        const articulos = await response.json();

        // Actualizar la tabla con los resultados
        const tabla = document.getElementById('tablaArticulos');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        //Podria optimizarse con un map
        // Llenar la tabla con los resultados con tiempo lo mejoro
        articulos.forEach(articulo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${articulo.id_articulo}</td>
                <td>${articulo.nombre_articulo}</td>
                <td>${articulo.detalles}</td>
                <td>
                <button class="btn btn-warning" onclick="editarArticulo(${articulo.id_articulo})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                <button class="btn btn-danger" onclick="eliminarArticulo(${articulo.id_articulo})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
                </td>
            `;
            tbody.appendChild(row);
        });

        tabla.style.display = 'table'; // Mostrar la tabla
    } catch (error) {
        console.error('Error al buscar el artículo:', error);
        const tabla = document.getElementById('tablaArticulos');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="7">No se encontraron resultados</td></tr>';
    }
};

// Manejar el evento de búsqueda
const buscador = document.getElementById('buscador');
buscador.addEventListener('input', (event) => {
    const nombre = event.target.value.trim();
    if (nombre === '') {
        verTablasButton.click(); // Mostrar todos los artículos si el buscador está vacío
    } else {
        buscarArticulo(nombre); // Buscar coincidencias
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.getElementById('tablaArticulos');
    const tbody = tabla.querySelector('tbody');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const verTablasButton = document.getElementById('verTablas');

    let currentPage = 1;
    const rowsPerPage = 8;
    let totalRows = 0;
    let articulos = []; // Variable global para almacenar los datos

    // Función para renderizar filas
    function renderRows() {
        tbody.innerHTML = ''; // Limpia las filas existentes
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const rows = articulos.slice(start, end); // Obtiene solo las filas de la página actual

        rows.forEach(articulo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${articulo.id_articulo}</td>
                <td>${articulo.nombre_articulo}</td>
                <td>${articulo.detalles}</td>
                <td>
                    <button class="btn btn-warning" onclick="editarArticulo(${articulo.id_articulo})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                    <button class="btn btn-danger" onclick="eliminarArticulo(${articulo.id_articulo})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
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
            const response = await fetch('/articulos'); // Endpoint para obtener los artículos
            if (!response.ok) {
                throw new Error('Error al obtener los artículos.');
            }
            articulos = await response.json(); // Guarda los datos en la variable global
            totalRows = articulos.length; // Actualiza el total de filas

            currentPage = 1; // Reinicia a la primera página
            renderRows(); // Renderiza las filas de la primera página
            tabla.style.display = 'table'; // Muestra la tabla
        } catch (error) {
            console.error('Error al cargar los artículos:', error);
        }
    });

    // Renderiza la primera página al cargar (opcional, si quieres mostrar datos simulados)
    renderRows();
});

// Función para editar un artículo (abre el modal y carga los datos)
const editarArticulo = async (id_articulo) => {
    try {
        const response = await fetch(`/articulos/${id_articulo}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del artículo.');
        }
        const articulo = await response.json();

        // Llenar el formulario del modal con los datos del artículo
        document.getElementById('editar_id_articulo').value = articulo.id_articulo;
        document.getElementById('editar_nombre_articulo').value = articulo.nombre_articulo;
        document.getElementById('editar_detalles').value = articulo.detalles;

        // Mostrar el modal
        document.getElementById('modalEditar').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar los datos del artículo:', error);
    }
};

// Función para eliminar un artículo
const eliminarArticulo = async (id_articulo) => {
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

            if (!response.ok) {
                throw new Error('Error al eliminar el artículo.');
            }

            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "Artículo eliminado con éxito.",
            });

            verTablasButton.click(); // Recargar la tabla
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