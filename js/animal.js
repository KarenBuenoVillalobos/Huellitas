// Llenar el combobox de especies
const loadEspecies = async () => {
    try {
        const response = await fetch('/animales/especies'); // Endpoint para obtener las especies
        if (!response.ok) {
            throw new Error('Error al obtener las especies');
        }
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

// Manejar el envío del formulario
const form = document.getElementById('animalForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Llamar a la función de validación
    if (!validarFormulario()) {
        return; // Detener el envío si hay errores
    }

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
                text: errorData.error || "Error al registrar el animal.",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Animal registrado con éxito.",
        });

        form.reset();

        // Limpia el contenido del span y el campo de archivo
        const fileNameDisplay = document.getElementById('fileNameDisplay');
        if (fileNameDisplay) {
            fileNameDisplay.textContent = ''; // Limpia el texto del span
        }
        const fileInput = document.getElementById('foto_animal');
        if (fileInput) {
            fileInput.value = ''; // Limpia el valor del input file
        }
    } catch (error) {
        console.error('Error al registrar el animal:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al registrar el animal. Intente más tarde.",
        });
    }
});

// Manejar el botón "Ver Tablas"
const verTablasButton = document.getElementById('verTablas');
verTablasButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/animales'); // Endpoint para obtener los animales
        if (!response.ok) {
            throw new Error('Error al obtener los animales');
        }
        const animales = await response.json();

        const tabla = document.getElementById('tablaAnimales');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        //corregir esto
        animales.forEach(animal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${animal.id_animal}</td>
                <td>${animal.nombre_animal}</td>
                <td>${animal.nombre_especie}</td>
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

        tabla.style.display = 'table'; // Mostrar la tabla
    } catch (error) {
        console.error('Error al cargar los animales:', error);
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

    const id_animal = document.getElementById('editar_id_animal').value;
    const formData = new FormData(editarForm);

    try {
        const response = await fetch(`/animales/${id_animal}`, {
            method: 'PUT',
            body: formData, // Enviar los datos como FormData para incluir la imagen
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el animal');
        }

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Animal actualizado con éxito.",
        });

        document.getElementById('modalEditar').style.display = 'none'; // Cerrar el modal
        verTablasButton.click(); // Recargar la tabla
    } catch (error) {
        console.error('Error al actualizar el animal:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar el animal. Intente más tarde.",
        });
    }
});

// Manejar el cierre del modal
document.getElementById('cerrarModal').addEventListener('click', () => {
    document.getElementById('modalEditar').style.display = 'none';
});

// Función para buscar animales por nombre, falta arreglar que muestre por especie jaja
const buscarAnimal = async (nombre) => {
    try {
        const response = await fetch(`/animales/nombre/${nombre}`);
        if (!response.ok) {
            throw new Error('Error al buscar el animal');
        }
        const animales = await response.json();

        // Actualizar la tabla con los resultados
        const tabla = document.getElementById('tablaAnimales');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        //Podria optimizarse con un map
        // Llenar la tabla con los resultados con tiempo lo mejoro
        animales.forEach(animal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${animal.id_animal}</td>
                <td>${animal.nombre_animal}</td>
                <td>${animal.especie}</td>
                <td>${animal.edad}</td>
                <td>${animal.descripcion}</td>
                <td><img src="/uploads/${animal.foto_animal}" alt="Foto" width="50"></td>
                <td>
                <button class="btn btn-warning" onclick="editarAnimal(${animal.id_animal})"><img src="/img/icon-editar.png" alt="btn-editar"></button>
                <button class="btn btn-danger" onclick="eliminarAnimal(${animal.id_animal})"><img src="/img/icon-eliminar.png" alt="btn-eliminar"></button>
                </td>
            `;
            tbody.appendChild(row);
        });

        tabla.style.display = 'table'; // Mostrar la tabla
    } catch (error) {
        console.error('Error al buscar el animal:', error);
        const tabla = document.getElementById('tablaAnimales');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="7">No se encontraron resultados</td></tr>';
    }
};

// Manejar el evento de búsqueda
const buscador = document.getElementById('buscador');
buscador.addEventListener('input', (event) => {
    const nombre = event.target.value.trim();
    if (nombre === '') {
        verTablasButton.click(); // Mostrar todos los animales si el buscador está vacío
    } else {
        buscarAnimal(nombre); // Buscar coincidencias
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.getElementById('tablaAnimales');
    const tbody = tabla.querySelector('tbody');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const verTablasButton = document.getElementById('verTablas');

    let currentPage = 1;
    const rowsPerPage = 8;
    let totalRows = 0;
    let animales = []; // Variable global para almacenar los datos

    // Función para renderizar filas
    function renderRows() {
        tbody.innerHTML = ''; // Limpia las filas existentes
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const rows = animales.slice(start, end); // Obtiene solo las filas de la página actual

        rows.forEach(animal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${animal.id_animal}</td>
                <td>${animal.nombre_animal}</td>
                <td>${animal.nombre_especie}</td>
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
            const response = await fetch('/animales'); // Endpoint para obtener los animales
            if (!response.ok) {
                throw new Error('Error al obtener los animales');
            }
            animales = await response.json(); // Guarda los datos en la variable global
            totalRows = animales.length; // Actualiza el total de filas

            currentPage = 1; // Reinicia a la primera página
            renderRows(); // Renderiza las filas de la primera página
            tabla.style.display = 'table'; // Muestra la tabla
        } catch (error) {
            console.error('Error al cargar los animales:', error);
        }
    });

    // Renderiza la primera página al cargar (opcional, si quieres mostrar datos simulados)
    renderRows();
});

// Función para editar un animal (abre el modal y carga los datos)
const editarAnimal = async (id_animal) => {
    try {
        const response = await fetch(`/animales/${id_animal}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del animal');
        }
        const animal = await response.json();

        // Llenar el formulario del modal con los datos del animal
        document.getElementById('editar_id_animal').value = animal.id_animal;
        document.getElementById('editar_nombre_animal').value = animal.nombre_animal;
        document.getElementById('editar_edad').value = animal.edad;
        document.getElementById('editar_descripcion').value = animal.descripcion;

        // Mostrar la imagen actual del animal
        const imgElement = document.getElementById('editar_imagen_preview');
        if (animal.foto_animal) {
            imgElement.src = `/uploads/${animal.foto_animal}`;
            imgElement.style.display = 'block';
        } else {
            imgElement.style.display = 'none';
        }

        // Cargar las especies en el combobox del modal
        const especiesResponse = await fetch('/animales/especies');
        if (!especiesResponse.ok) {
            throw new Error('Error al obtener las especies');
        }
        const especies = await especiesResponse.json();
        const selectEspecie = document.getElementById('editar_id_especie');
        selectEspecie.innerHTML = ''; // Limpiar el contenido del select
        especies.forEach(especie => {
            const option = document.createElement('option');
            option.value = especie.id_especie;
            option.textContent = especie.nombre_especie;
            if (especie.id_especie === animal.id_especie) {
                option.selected = true;
            }
            selectEspecie.appendChild(option);
        });

        // Mostrar el modal
        document.getElementById('modalEditar').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar los datos del animal:', error);
    }
};

// Función para eliminar un animal
const eliminarAnimal = async (id_animal) => {
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
            const response = await fetch(`/animales/${id_animal}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el animal');
            }

            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "Animal eliminado con éxito.",
            });

            verTablasButton.click(); // Recargar la tabla
        } catch (error) {
            console.error('Error al eliminar el animal:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al eliminar el animal. Intente más tarde.",
            });
        }
    }
};

// Función para validar el formulario
const validarFormulario = (esEdicion = false ) => {
    const nombre = document.getElementById(esEdicion ? 'editar_nombre_animal' : 'nombre_animal').value.trim();
    const especie = document.getElementById(esEdicion ? 'editar_id_especie' : 'id_especie').value;
    const edad = document.getElementById(esEdicion ? 'editar_edad' : 'edad').value.trim();
    const descripcion = document.getElementById(esEdicion ? 'editar_descripcion' : 'descripcion').value.trim();
    const foto = document.getElementById(esEdicion ? 'editar_foto_animal' : 'foto_animal');

    // Validaciones con SweetAlert
    const nombreRegex = /^[a-zA-Z\s]+$/; // Solo permite letras y espacios
    // Validación del nombre, especie, eddad, descripción y foto.
    if (!nombre) {
        Swal.fire({
            icon: "error",
            title: "Campo requerido",
            text: "El nombre no puede estar en blanco. Por favor, ingresa un nombre.",
        });
        return false;
    }

    if (!nombreRegex.test(nombre)) {
        Swal.fire({
            icon: "error",
            title: "Nombre inválido",
            text: "El nombre solo puede contener letras y espacios. No se permiten números ni caracteres especiales.",
        });
        return false;
    }

    if (nombre.length < 3 || nombre.length > 15) {
        Swal.fire({
            icon: "error",
            title: "Longitud inválida",
            text: "El nombre debe tener entre 3 y 15 caracteres.",
        });
        return false;
    }

    if (!especie || especie === "") {
        Swal.fire({
            icon: "error",
            title: "Campo requerido",
            text: "Por favor, selecciona una especie.",
        });
        return false;
    }
    const regex = /^[0-9]+$/;
    if (!edad || !regex.test(edad) || edad < 1 || edad >= 100) {
        Swal.fire({
            icon: "error",
            title: "Edad inválida",
            text: "Por favor, ingresa una edad válida (entre 1 y 100, solo números).",
        });
        return false;
    }

    if (!descripcion) {
        Swal.fire({
            icon: "error",
            title: "Campo requerido",
            text: "Por favor, ingresa una descripción.",
        });
        return false;
    }
    if (descripcion.length > 50) {
        Swal.fire({
            icon: "error",
            title: "Descripción demasiado larga",
            text: "La descripción no puede exceder los 50 caracteres.",
        });
        return false;
    }
    return true;
};