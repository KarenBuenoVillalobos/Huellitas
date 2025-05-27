// Variables globales
let animales = [];
let currentPage = 1;
const rowsPerPage = 8;
let totalRows = 0;
let sortColumn = null;
let sortDirection = 'asc';

// Cargar especies en el select
const loadEspecies = async () => {
    try {
        const response = await fetch('/animales/especies');
        if (!response.ok) throw new Error('Error al obtener las especies');
        const especies = await response.json();

        const selectEspecie = document.getElementById('id_especie');
        especies.forEach(especie => {
            const option = document.createElement('option');
            option.value = especie.id_especie;
            option.textContent = especie.nombre_especie;
            selectEspecie.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las especies:', error);
    }
};

document.addEventListener('DOMContentLoaded', loadEspecies);

// Registrar animal
const form = document.getElementById('animalForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validarFormulario()) return;
    const formData = new FormData(form);

    try {
        const response = await fetch('/animales', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorData.error || "Error al registrar la huellita.",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Huellita registrada con éxito.",
        });

        form.reset();
        document.getElementById('verTablas').click(); // Recarga la tabla
    } catch (error) {
        console.error('Error al registrar la huellita:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al registrar la huellita. Intente más tarde.",
        });
    }
});

// Renderizar filas de la tabla con paginación y ordenamiento
function renderRows() {
    const tabla = document.getElementById('tablaAnimales');
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const rows = animales.slice(start, end);
    rows.forEach((animal, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${animal.nombre_animal}</td>
            <td>${animal.nombre_especie || animal.especie}</td>
            <td>${animal.edad}</td>
            <td>${animal.descripcion}</td>
            <td><img src="/uploads/${animal.foto_animal}" alt="Foto" width="60"></td>
            <td>
                <button class="btn btn-warning" onclick="editarAnimal(${animal.id_animal})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                <button class="btn btn-danger" onclick="eliminarAnimal(${animal.id_animal})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    // Actualiza la información de la página
    document.getElementById('pageInfo').textContent = `${currentPage}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === Math.ceil(totalRows / rowsPerPage);
}

// Ordenar animales por columna
function sortAnimales(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    animales.sort((a, b) => {
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
        const response = await fetch('/animales');
        if (!response.ok) throw new Error('Error al obtener las huellitas.');
        animales = await response.json();
        totalRows = animales.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaAnimales').style.display = 'table';
    } catch (error) {
        console.error('Error al cargar las huellitas:', error);
    }
});

// Buscar animales por nombre
const buscarAnimal = async (nombre) => {
    try {
        const response = await fetch(`/animales/nombre/${nombre}`);
        if (!response.ok) throw new Error('Error al buscar el animal');
        animales = await response.json();
        totalRows = animales.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaAnimales').style.display = 'table';
    } catch (error) {
        console.error('Error al buscar la huellita:', error);
        const tabla = document.getElementById('tablaAnimales');
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
        buscarAnimal(nombre);
    }
});

// Encabezados ordenables
document.addEventListener('DOMContentLoaded', () => {
    const ths = document.querySelectorAll('#tablaAnimales thead th');
    // El primer th es el incremental, los siguientes son los campos reales
    const columns = [null, 'nombre_animal', 'nombre_especie', 'edad'];
    ths.forEach((th, i) => {
        if (columns[i]) {
            th.style.cursor = 'pointer';
            th.onclick = () => sortAnimales(columns[i]);
        }
    });
    // Inicializar el primer ordenamiento
});

// Función para editar un animal (abre el modal y carga los datos)
window.editarAnimal = async (id_animal) => {
    try {
        const response = await fetch(`/animales/${id_animal}`);
        if (!response.ok) throw new Error('Error al obtener los datos del animal');
        const animal = await response.json();
        // Cargar datos en el modal
        document.getElementById('editar_id_animal').value = animal.id_animal;
        document.getElementById('editar_nombre_animal').value = animal.nombre_animal;
        document.getElementById('editar_edad').value = animal.edad;
        document.getElementById('editar_descripcion').value = animal.descripcion;

        // Mostrar la imagen actual
        const imgElement = document.getElementById('editar_imagen_preview');
        if (animal.foto_animal) {
            imgElement.src = `/uploads/${animal.foto_animal}`;
            imgElement.style.display = 'block';
        } else {
            imgElement.style.display = 'none';
        }
        // Cargar especies en el combobox del modal
        const especiesResponse = await fetch('/animales/especies');
        if (!especiesResponse.ok) throw new Error('Error al obtener las especies');
        const especies = await especiesResponse.json();
        const selectEspecie = document.getElementById('editar_id_especie');
        selectEspecie.innerHTML = '';
        especies.forEach(especie => {
            const option = document.createElement('option');
            option.value = especie.id_especie;
            option.textContent = especie.nombre_especie;
            if (especie.id_especie === animal.id_especie) option.selected = true;
            selectEspecie.appendChild(option);
        });

        // Mostrar el modal
        document.getElementById('modalEditar').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar los datos de la huellita:', error);
    }
};

// Eliminar animal
window.eliminarAnimal = async (id_animal) => {
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
            const response = await fetch(`/animales/${id_animal}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar la huellita.');
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "Animal eliminado con éxito.",
            });
            document.getElementById('verTablas').click();
        } catch (error) {
            console.error('Error al eliminar la huellita:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al eliminar la huellita. Intente más tarde.",
            });
        }
    }
};

// Cerrar modal
document.getElementById('cerrarModal').addEventListener('click', () => {
    document.getElementById('modalEditar').style.display = 'none';
});

// Editar animal (guardar cambios)
document.getElementById('editarForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validarFormulario(true)) return;
    const id_animal = document.getElementById('editar_id_animal').value;
    const formData = new FormData(document.getElementById('editarForm'));
    try {
        const response = await fetch(`/animales/${id_animal}`, {
            method: 'PUT',
            body: formData,
        });
        if (!response.ok) throw new Error('Error al actualizar la huellita.');
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Huellita actualizada con éxito.",
        });
        document.getElementById('modalEditar').style.display = 'none';
        document.getElementById('verTablas').click();
    } catch (error) {
        console.error('Error al actualizar el animal:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar la huellita. Intente más tarde.",
        });
    }
});

// Validación de formulario
function validarFormulario(esEdicion = false) {
    const nombre = document.getElementById(esEdicion ? 'editar_nombre_animal' : 'nombre_animal').value.trim();
    const especie = document.getElementById(esEdicion ? 'editar_id_especie' : 'id_especie').value;
    const edad = document.getElementById(esEdicion ? 'editar_edad' : 'edad').value.trim();
    const descripcion = document.getElementById(esEdicion ? 'editar_descripcion' : 'descripcion').value.trim();
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

    if (nombre.length < 3 || nombre.length > 15) {
        Swal.fire({ icon: "error", title: "Longitud inválida", text: "El nombre debe tener entre 3 y 15 caracteres." });
        return false;
    }

    if (!especie || especie === "") {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, selecciona una especie." });
        return false;
    }
    const regex = /^[0-9]+$/;
    if (!edad || !regex.test(edad) || edad < 1 || edad >= 100) {
        Swal.fire({ icon: "error", title: "Edad inválida", text: "Por favor, ingresa una edad válida (entre 1 y 100, solo números)." });
        return false;
    }

    if (!descripcion) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, ingresa una descripción." });
        return false;
    }
    if (descripcion.length > 50) {
        Swal.fire({ icon: "error", title: "Descripción demasiado larga", text: "La descripción no puede exceder los 50 caracteres." });
        return false;
    }
    return true;
}