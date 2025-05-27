// Variables globales
let adopciones = [];
let currentPage = 1;
const rowsPerPage = 8;
let totalRows = 0;
let sortColumn = null;
let sortDirection = 'asc';

// Cargar animales en el select
const loadAnimales = async () => {
    try {
        const response = await fetch('/adopciones/animales');
        if (!response.ok) throw new Error('Error al obtener los animalitos.');
        const animales = await response.json();

        const selectAnimal = document.getElementById('id_animal');
        animales.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.id_animal;
            option.textContent = animal.nombre_animal;
            selectAnimal.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los animales:', error);
    }
};

// const loadAnimalesDisponibles = async () => {
//     const response = await fetch('/adopciones/animales-disponibles');
//     const animales = await response.json();
//     const select = document.getElementById('id_animal');
//     select.innerHTML = '';
//     animales.forEach(animal => {
//         const option = document.createElement('option');
//         option.value = animal.id_animal;
//         option.textContent = animal.nombre_animal;
//         select.appendChild(option);
//     });
// };

// const loadAnimalesParaEdicion = async (id_animal_actual) => {
//     const response = await fetch('/adopciones/animales-disponibles');
//     let animales = await response.json();

//     // Si el animal actual no está en la lista, lo agregamos
//     if (!animales.some(a => a.id_animal == id_animal_actual)) {
//         // Puedes obtener el nombre del animal actual desde la base o desde el objeto de la adopción
//         const nombre_actual = document.getElementById('editar_nombre_animal')?.value || 'Animal actual';
//         animales.push({ id_animal: id_animal_actual, nombre_animal: nombre_actual });
//     }

//     const select = document.getElementById('editar_id_animal');
//     select.innerHTML = '';
//     animales.forEach(animal => {
//         const option = document.createElement('option');
//         option.value = animal.id_animal;
//         option.textContent = animal.nombre_animal;
//         if (animal.id_animal == id_animal_actual) option.selected = true;
//         select.appendChild(option);
//     });
// };

document.addEventListener('DOMContentLoaded', loadAnimales);

const form = document.getElementById('adopcionForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validarFormulario()) return;

    // Tomá los valores de los campos
    const nombre = document.getElementById('nombre_apellido').value;
    const id_animal = document.getElementById('id_animal').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const fecha_adopcion = document.getElementById('fecha_adopcion').value;

    const body = {
        nombre,
        id_animal,
        telefono,
        direccion,
        fecha_adopcion
    };

    try {
        const response = await fetch('/adopciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorData.error || "Error al registrar la adopción.",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Adopción registrada con éxito.",
        });

        form.reset();
        document.getElementById('verTablas').click(); // Recarga la tabla
    } catch (error) {
        console.error('Error al registrar la adopción:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al registrar la adopción. Intente más tarde.",
        });
    }
});

// Renderizar filas de la tabla con paginación y ordenamiento
function renderRows() {
    const tabla = document.getElementById('tablaAdopciones');
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const rows = adopciones.slice(start, end);
    rows.forEach((adopcion, index) => {
        // Formatear la fecha
        let fecha = adopcion.fecha_adopcion;
        if (fecha) {
            const d = new Date(fecha);
            fecha = d.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
        } else {
            fecha = '';
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${adopcion.nombre_usuario || adopcion.nombre_apellido || adopcion.nombre}</td>
            <td>${adopcion.nombre_animal}</td>
            <td>${adopcion.telefono}</td>
            <td>${adopcion.direccion}</td>
            <td>${fecha}</td>
            <td>
                <button class="btn btn-warning" onclick="editarAdopcion(${adopcion.id_adopcion})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                <button class="btn btn-danger" onclick="eliminarAdopcion(${adopcion.id_adopcion})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
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
    adopciones.sort((a, b) => {
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
        const response = await fetch('/adopciones');
        if (!response.ok) throw new Error('Error al obtener las adopciones.');
        adopciones = await response.json();
        totalRows = adopciones.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaAdopciones').style.display = 'table';
    } catch (error) {
        console.error('Error al cargar las adopciones:', error);
    }
});

const buscarAdopcion = async (valor) => {
    try {
        // Primero intenta buscar por nombre del adoptante
        let response = await fetch(`/adopciones/nombre/${valor}`);
        if (response.ok) {
            adopciones = await response.json();
            if (adopciones.length > 0) {
                totalRows = adopciones.length;
                currentPage = 1;
                renderRows();
                document.getElementById('tablaAdopciones').style.display = 'table';
                return;
            }
        }
        // Si no hay resultados, busca por nombre de animal
        response = await fetch(`/adopciones/animal/${valor}`);
        if (!response.ok) throw new Error('Error al buscar la adopción.');
        adopciones = await response.json();
        totalRows = adopciones.length;
        currentPage = 1;
        renderRows();
        document.getElementById('tablaAdopciones').style.display = 'table';
    } catch (error) {
        console.error('Error al buscar la adopción:', error);
        const tabla = document.getElementById('tablaAdopciones');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="7">No se encontraron resultados</td></tr>';
    }
};

// Evento de búsqueda
document.getElementById('buscador').addEventListener('input', (event) => {
    const valor = event.target.value.trim();
    if (valor === '') {
        document.getElementById('verTablas').click();
    } else {
        buscarAdopcion(valor);
    }
});

// Encabezados ordenables
document.addEventListener('DOMContentLoaded', () => {
    const ths = document.querySelectorAll('#tablaAdopciones thead th');
    // El primer th es el incremental, los siguientes son los campos reales
    const columns = [null, 'nombre_apellido', 'nombre_animal'];
    ths.forEach((th, i) => {
        if (columns[i]) {
            th.style.cursor = 'pointer';
            th.onclick = () => sortAnimales(columns[i]);
        }
    });
    // Inicializar el primer ordenamiento
});

// Función para editar una adopcion (abre el modal y carga los datos)
window.editarAdopcion = async (id_adopcion) => {
    try {
        const response = await fetch(`/adopciones/${id_adopcion}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la adopción.');
        const adopcion = await response.json();

        // // Cargar animales disponibles y seleccionar el correcto
        // await loadAnimalesParaEdicion(adopcion.id_animal);

        // Cargar datos en el modal
        document.getElementById('editar_id_adopcion').value = adopcion.id_adopcion;
        document.getElementById('editar_id_usuario').value = adopcion.id_usuario;
        document.getElementById('editar_nombre_apellido').value = adopcion.nombre_apellido;
        document.getElementById('editar_telefono').value = adopcion.telefono;
        document.getElementById('editar_direccion').value = adopcion.direccion;
        // Formatear la fecha para el input date
        let fecha = adopcion.fecha_adopcion;
        if (fecha) {
            fecha = fecha.split('T')[0];
        }
        document.getElementById('editar_fecha_adopcion').value = fecha;
        // Cargar animales en el combobox del modal
        const animalesResponse = await fetch('/adopciones/animales');
        if (!animalesResponse.ok) throw new Error('Error al obtener los animales.');
        const animales = await animalesResponse.json();
        const selectAnimal = document.getElementById('editar_id_animal');
        selectAnimal.innerHTML = '';
        animales.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.id_animal;
            option.textContent = animal.nombre_animal;
            // Selecciona el animal correspondiente a la adopción
            if (animal.id_animal == adopcion.id_animal) option.selected = true;
            selectAnimal.appendChild(option);
        });

        // Mostrar el modal
        document.getElementById('modalEditar').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar los datos de la adopción:', error);
    }
};

// Eliminar adopcion
window.eliminarAdopcion = async (id_animal) => {
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
            const response = await fetch(`/adopciones/${id_adopcion}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar la adopción.');
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "Adopción eliminada con éxito.",
            });
            document.getElementById('verTablas').click();
        } catch (error) {
            console.error('Error al eliminar la adopción:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al eliminar la adopción. Intente más tarde.",
            });
        }
    }
};

// Cerrar modal
document.getElementById('cerrarModal').addEventListener('click', () => {
    document.getElementById('modalEditar').style.display = 'none';
});

document.getElementById('editarForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validarFormulario(true)) return;
    const id_adopcion = document.getElementById('editar_id_adopcion').value;
    const id_usuario = document.getElementById('editar_id_usuario').value;
    const id_animal = document.getElementById('editar_id_animal').value;
    const telefono = document.getElementById('editar_telefono').value;
    const direccion = document.getElementById('editar_direccion').value;
    const fecha_adopcion = document.getElementById('editar_fecha_adopcion').value;

    const body = {
        id_usuario,
        id_animal,
        telefono,
        direccion,
        fecha_adopcion
    };

    try {
        const response = await fetch(`/adopciones/${id_adopcion}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error('Error al actualizar la adopción.');
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Adopción actualizada con éxito.",
        });
        document.getElementById('modalEditar').style.display = 'none';
        document.getElementById('verTablas').click();
    } catch (error) {
        console.error('Error al actualizar la adopción:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar la adopción. Intente más tarde.",
        });
    }
});

// Validación de formulario
function validarFormulario(esEdicion = false) {
    // const nombre = document.getElementById(esEdicion ? 'editar_nombre_apellido' : 'nombre_apellido').value.trim();
    const animal = document.getElementById(esEdicion ? 'editar_id_animal' : 'id_animal').value;
    const telefono = document.getElementById(esEdicion ? 'editar_telefono' : 'telefono').value.trim();
    const direccion = document.getElementById(esEdicion ? 'editar_direccion' : 'direccion').value.trim();
    const fecha_adopcion = document.getElementById(esEdicion ? 'editar_fecha_adopcion' : 'fecha_adopcion').value;
    // Validaciones

    if (!animal || animal === "") {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, selecciona un animal." });
        return false;
    }

    if (!telefono) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, ingresa un teléfono." });
        return false;
    }

    if (!/^\d{10}$/.test(telefono)) {
        Swal.fire({ icon: "error", title: "Teléfono inválido", text: "El teléfono debe tener exactamente 10 números." });
        return false;
    }

    if (!direccion) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, ingresa una dirección." });
        return false;
    }

    if (direccion.length > 50) {
        Swal.fire({ icon: "error", title: "Dirección demasiado larga", text: "La dirección no puede exceder los 50 caracteres." });
        return false;
    }

    if (!fecha_adopcion) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, ingresa una fecha." });
        return false;
    }

    const hoy = new Date();
    const fechaIngresada = new Date(fecha_adopcion);
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