// document.getElementById('foto_animal').addEventListener('change', function () {
//     const fileName = this.files[0]?.name || "Subir archivo";
//     document.querySelector('.foto-container').textContent = fileName;
// });

// // Llenar el combobox de especies
//  const loadEspecies = async () => {
//     try {
//         const response = await fetch('/animales/especies'); // Endpoint para obtener las especies
//         if (!response.ok) {
//             throw new Error('Error al obtener las especies');
//         }
//         const especies = await response.json();

//         const selectEspecie = document.getElementById('id_especie');
//         especies.forEach(especie => {
//             const option = document.createElement('option');
//             option.value = especie.id_especie;
//             option.textContent = especie.nombre_especie;
//             selectEspecie.appendChild(option);
//         });
//     } catch (error) {
//         console.error('Error al cargar las especies:', error);
//     }
// };

// document.addEventListener('DOMContentLoaded', loadEspecies);

// // Manejar el envío del formulario
// const form = document.getElementById('animalForm');
// form.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const formData = new FormData(form);

//     try {
//         const response = await fetch('/animales', {
//             method: 'POST',
//             body: formData
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             alert(`Error: ${errorData.error}`);
//             return;
//         }

//         alert('Animal registrado con éxito');
//         form.reset();
//     } catch (error) {
//         console.error('Error al registrar el animal:', error);
//         alert('Error al registrar el animal. Intente más tarde.');
//     }
// });

// // Manejar el botón "Ver Tablas"
// const verTablasButton = document.getElementById('verTablas');
// verTablasButton.addEventListener('click', async () => {
//     try {
//         const response = await fetch('/animales'); // Endpoint para obtener los animales
//         if (!response.ok) {
//             throw new Error('Error al obtener los animales');
//         }
//         const animales = await response.json();

//         const tabla = document.getElementById('tablaAnimales');
//         const tbody = tabla.querySelector('tbody');
//         tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

//         //corregir esto
//         animales.forEach(animal => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${animal.id_animal}</td>
//                 <td>${animal.nombre_animal}</td>
//                 <td>${animal.nombre_especie}</td>
//                 <td>${animal.edad}</td>
//                 <td>${animal.descripcion}</td>
//                 <td><img src="/uploads/${animal.foto_animal}" alt="Foto" width="50"></td>
//                 <td>
//                     <button class="btn btn-warning" onclick="editarAnimal(${animal.id_animal})">Editar</button>
//                     <button class="btn btn-danger" onclick="eliminarAnimal(${animal.id_animal})">Eliminar</button>
//                 </td>
//             `;
//             tbody.appendChild(row);
//         });

//         tabla.style.display = 'table'; // Mostrar la tabla
//     } catch (error) {
//         console.error('Error al cargar los animales:', error);
//     }
// });

// // Función para abrir el modal y cargar los datos del animal
// const editarAnimal = async (id_animal) => {
//     try {
//         // Obtener los datos del animal desde el servidor
//         const response = await fetch(`/animales/${id_animal}`);
//         if (!response.ok) {
//             throw new Error('Error al obtener los datos del animal');
//         }
//         const animal = await response.json();

//         // Llenar el formulario del modal con los datos del animal
//         document.getElementById('editar_id_animal').value = animal.id_animal;
//         document.getElementById('editar_nombre_animal').value = animal.nombre_animal;
//         document.getElementById('editar_edad').value = animal.edad;
//         document.getElementById('editar_descripcion').value = animal.descripcion;

//         // Mostrar la imagen actual del animal
//         const imgElement = document.getElementById('editar_imagen_preview');
//         if (animal.foto_animal) {
//             imgElement.src = `/uploads/${animal.foto_animal}`; // Ruta de la imagen
//             imgElement.style.display = 'block'; // Asegurarse de que la imagen sea visible
//         } else {
//             imgElement.style.display = 'none'; // Ocultar si no hay imagen
//         }

//         // Cargar las especies en el combobox del modal
//         const especiesResponse = await fetch('/animales/especies');
//         if (!especiesResponse.ok) {
//             throw new Error('Error al obtener las especies');
//         }
//         const especies = await especiesResponse.json();
//         const selectEspecie = document.getElementById('editar_id_especie');
//         selectEspecie.innerHTML = ''; // Limpiar el contenido del select
//         especies.forEach(especie => {
//             const option = document.createElement('option');
//             option.value = especie.id_especie;
//             option.textContent = especie.nombre_especie;
//             if (especie.id_especie === animal.id_especie) {
//                 option.selected = true;
//             }
//             selectEspecie.appendChild(option);
//         });

//         // Mostrar el modal
//         document.getElementById('modalEditar').style.display = 'block';
//     } catch (error) {
//         console.error('Error al cargar los datos del animal:', error);
//     }
// };

// // Manejar el envío del formulario de edición
// const editarForm = document.getElementById('editarForm');
// editarForm.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const id_animal = document.getElementById('editar_id_animal').value;
//     const formData = new FormData(editarForm);

//     try {
//         const response = await fetch(`/animales/${id_animal}`, {
//             method: 'PUT',
//             body: formData, // Enviar los datos como FormData para incluir la imagen
//         });

//         if (!response.ok) {
//             throw new Error('Error al actualizar el animal');
//         }

//         alert('Animal actualizado con éxito');
//         document.getElementById('modalEditar').style.display = 'none'; // Cerrar el modal
//         verTablasButton.click(); // Recargar la tabla
//     } catch (error) {
//         console.error('Error al actualizar el animal:', error);
//     }
// });

// // Manejar el cierre del modal
// document.getElementById('cerrarModal').addEventListener('click', () => {
//     document.getElementById('modalEditar').style.display = 'none';
// });

// // Función para eliminar un animal
// const eliminarAnimal = async (id_animal) => {
//     if (confirm('¿Estás seguro de que deseas eliminar este animal?')) {
//         try {
//             const response = await fetch(`/animales/${id_animal}`, {
//                 method: 'DELETE',
//             });

//             if (!response.ok) {
//                 throw new Error('Error al eliminar el animal');
//             }

//             alert('Animal eliminado con éxito');
//             verTablasButton.click(); // Recargar la tabla
//         } catch (error) {
//             console.error('Error al eliminar el animal:', error);
//             alert('Error al eliminar el animal. Intente más tarde.');
//         }
//     }
// };

// // Función para buscar animales por nombre, falta arreglar que muestre por especie jaja
// const buscarAnimal = async (nombre) => {
//     try {
//         const response = await fetch(`/animales/nombre/${nombre}`);
//         if (!response.ok) {
//             throw new Error('Error al buscar el animal');
//         }
//         const animales = await response.json();

//         // Actualizar la tabla con los resultados
//         const tabla = document.getElementById('tablaAnimales');
//         const tbody = tabla.querySelector('tbody');
//         tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

//         //Podria optimizarse con un map
//         // Llenar la tabla con los resultados con tiempo lo mejoro
//         animales.forEach(animal => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${animal.id_animal}</td>
//                 <td>${animal.nombre_animal}</td>
//                 <td>${animal.especie}</td>
//                 <td>${animal.edad}</td>
//                 <td>${animal.descripcion}</td>
//                 <td><img src="/uploads/${animal.foto_animal}" alt="Foto" width="50"></td>
//                 <td>
//                     <button class="btn btn-danger" onclick="eliminarAnimal(${animal.id_animal})">Eliminar</button>
//                     <button class="btn btn-warning" onclick="editarAnimal(${animal.id_animal})">Editar</button>
//                 </td>
//             `;
//             tbody.appendChild(row);
//         });

//         tabla.style.display = 'table'; // Mostrar la tabla
//     } catch (error) {
//         console.error('Error al buscar el animal:', error);
//         const tabla = document.getElementById('tablaAnimales');
//         const tbody = tabla.querySelector('tbody');
//         tbody.innerHTML = '<tr><td colspan="7">No se encontraron resultados</td></tr>';
//     }
// };

// // Manejar el evento de búsqueda
// const buscador = document.getElementById('buscador');
// buscador.addEventListener('input', (event) => {
//     const nombre = event.target.value.trim();
//     if (nombre === '') {
//         verTablasButton.click(); // Mostrar todos los animales si el buscador está vacío
//     } else {
//         buscarAnimal(nombre); // Buscar coincidencias
//     }
// });

//CODIGO COMPLETO REFACTORIZADO (CON PAGINACION)
/*document.getElementById('foto_animal').addEventListener('change', function () {
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    if (fileNameDisplay) {
        fileNameDisplay.textContent = this.files[0]?.name || 'No se seleccionó ningún archivo';
    }
});*/

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

    const formData = new FormData(form);

    try {
        const response = await fetch('/animales', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
            return;
        }

        alert('Animal registrado con éxito');
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
        alert('Error al registrar el animal. Intente más tarde.');
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
                <td><img src="/uploads/${animal.foto_animal}" alt="Foto" width="50"></td>
                <td>
                    <button class="btn btn-warning" onclick="editarAnimal(${animal.id_animal})">Editar</button>
                    <button class="btn btn-danger" onclick="eliminarAnimal(${animal.id_animal})">Eliminar</button>
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

        alert('Animal actualizado con éxito');
        document.getElementById('modalEditar').style.display = 'none'; // Cerrar el modal
        verTablasButton.click(); // Recargar la tabla
    } catch (error) {
        console.error('Error al actualizar el animal:', error);
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
                <button class="btn btn-warning" onclick="editarAnimal(${animal.id_animal})">Editar</button>
                <button class="btn btn-danger" onclick="eliminarAnimal(${animal.id_animal})">Eliminar</button>
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
                <td><img src="/uploads/${animal.foto_animal}" alt="Foto" width="50"></td>
                <td>
                    <button class="btn btn-warning" onclick="editarAnimal(${animal.id_animal})">Editar</button>
                    <button class="btn btn-danger" onclick="eliminarAnimal(${animal.id_animal})">Eliminar</button>
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
    if (confirm('¿Estás seguro de que deseas eliminar este animal?')) {
        try {
            const response = await fetch(`/animales/${id_animal}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el animal');
            }

            alert('Animal eliminado con éxito');
            verTablasButton.click(); // Recargar la tabla

        } catch (error) {
            console.error('Error al eliminar el animal:', error);
            alert('Error al eliminar el animal. Intente más tarde.');
        }
    }
};