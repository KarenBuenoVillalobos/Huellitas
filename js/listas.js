document.addEventListener('DOMContentLoaded', function () {
    const openModal = document.querySelector('.agregar-abm');
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.modal__close');
    const tblListado = document.querySelector('.tbl-listado table');
    const btnBuscar = document.querySelector('#buscar-id');
    const btnEliminar = document.querySelector('#eliminar');
    let animales = []; // Array para almacenar los animales

    // Llamar a la función para inicializar la tabla
    //crearTablaListado();

    openModal.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('modal--show');
    });

    closeModal.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.remove('modal--show');
    });

    const btnAgregar = document.querySelector('.btn__agregar');
    btnAgregar.addEventListener('click', (e) => {
        e.preventDefault();
        // Validaciones de los campos
        const nombre_animal = document.querySelector('#nombre_animal').value;
        const especie = document.querySelector('#especie').value;
        const edad = document.querySelector('#edad').value;
        const descripcion = document.querySelector('#descripcion').value;
        const foto_animal = document.querySelector('#foto_animal').value;

        //Paso los datos a una funcion que me valida los datos
        const validar = validarDatosAnimales(nombre_animal, especie, edad, descripcion, foto_animal);
        //Si el valor es TRUE me agrega el animal
        if (validar == true) {
            // Crear el objeto de animal
            const id_animal = animales.length + 1; // Generar un ID autoincremental
            const nuevoAnimal = {
                id_animal: id_animal,
                nombre_animal: nombre_animal,
                especie: especie,
                edad: parseInt(edad),
                descripcion: descripcion,
                foto_animal: foto_animal
            };

            // Agregar el nuevo animal al array
            animales.push(nuevoAnimal);

            // Actualizar la tabla
            actualizarTabla();

            // Limpiar los campos del formulario
            limpiarCampos();

            // Cerrar el modal
            modal.classList.remove('modal--show');
        }

    });

    // Función para actualizar la tabla con los datos de animales
    function actualizarTabla() {
        // Limpiar la tabla
        tblListado.innerHTML = `
            <tr>
                <th>ID Animal</th>
                <th>Nombre Animal</th>
                <th>Especie</th>
                <th>Edad</th>
                <th>Descripción</th>
                <th>Foto Animal</th>
            </tr>
        `;

        // Agregar cada animal a la tabla
        animales.forEach(animal => {
            tblListado.innerHTML += `
                <tr>
                    <td>${animal.id_animal}</td>
                    <td>${animal.nombre_animal}</td>
                    <td>${animal.especie}</td>
                    <td>${animal.edad}</td>
                    <td>${animal.descripcion}</td>
                    <td>${animal.foto_animal}</td>
                    <td><button class="btn-modificar" data-id="${animal.id_animal}"></button><button class="btn-eliminar" data-id="${animal.id_animal}"></button></td>
                </tr>
            `;
        });

        // Agregar event listener a los botones de modificar
        document.querySelectorAll('.btn-modificar').forEach(button => {
            button.addEventListener('click', (e) => {
                const id_animal = parseInt(e.target.getAttribute('data-id'));
                cargarAnimalParaModificar(id_animal);
            });
        });

        // Agregar el event listener a los botones de eliminar
        document.querySelectorAll('.btn-eliminar').forEach(button => {
            button.addEventListener('click', (e) => {
                const id_animal = parseInt(e.target.getAttribute('data-id'));
                eliminarAnimal(id_animal);
            });
        });
    }

    function cargarAnimalParaModificar(id_animal) {
        const animal = animales.find(ani => ani.id_animal === id_animal);
        if (animal) {
            document.querySelector('#nombre_animal').value = animal.nombre_animal;
            document.querySelector('#especie').value = animal.especie;
            document.querySelector('#edad').value = animal.edad;
            document.querySelector('#descripcion').value = animal.descripcion;
            document.querySelector('#foto_animal').value = animal.foto_animal;

            // Abrir el modal
            modal.classList.add('modal--show');

            // Cambiar el texto del botón crear por "Guardar cambios"
            const btnAgregar = document.querySelector('.btn__agregar');
            btnAgregar.textContent = 'Guardar cambios';

            // Remover event listeners anteriores para evitar múltiples listeners
            btnAgregar.replaceWith(btnAgregar.cloneNode(true));
            const newBtnAgregar = document.querySelector('.btn__agregar');

            newBtnAgregar.addEventListener('click', (e) => {
                e.preventDefault();
                guardarCambios(id_animal);
            });
        }
    }

    function guardarCambios(id_animal) {
        // Obtener los datos modificados del formulario
        const nombre_animal = document.querySelector('#nombre_animal').value;
        const especie = document.querySelector('#especie').value;
        const edad = document.querySelector('#edad').value;
        const descripcion = document.querySelector('#descripcion').value;
        const foto_animal = document.querySelector('#foto_animal').value;

        //Paso los datos a una funcion que me valida los datos
        const validar = validarDatosAnimales(nombre_animal, especie, edad, descripcion, foto_animal);
    
        if (validar) {
            // Mostrar confirmación con swal
            Swal.fire({
                title: "¿Estás seguro?",
                text: "¿Quieres guardar los cambios?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ffbe70",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí",
                cancelButtonText: "No"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Actualizar el animal en el array
                    const animal = animales.find(ani => ani.id_animal === id_animal);
                    if (animal) {
                        animal.nombre_animal = nombre_animal;
                        animal.especie = especie;
                        animal.edad = parseInt(edad);
                        animal.descripcion = descripcion;
                        animal.foto_animal = foto_animal;
    
                        // Actualizar la tabla
                        actualizarTabla();
    
                        // Limpiar los campos del formulario
                        limpiarCampos();
    
                        // Cerrar el modal
                        modal.classList.remove('modal--show');
    
                        // Restaurar el texto del botón a "Agregar"
                        const btnAgregar = document.querySelector('.btn__agregar');
                        btnAgregar.textContent = 'Agregar';
                    }
                }
            });
        }
    }
    

    // Función para eliminar un animal
    function eliminarAnimal(id_animal) {
        // Mostrar confirmación con swal
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Quieres eliminar este animal?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffbe70",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Eliminar el animal del array
                animales = animales.filter(animal => animal.id_animal !== id_animal);
    
                // Actualizar la tabla
                actualizarTabla();
            } else {
                // Cerrar el modal si el usuario cancela
                modal.classList.remove('modal--show');
            }
        });
    }
    

    // Función para limpiar los campos del formulario
    function limpiarCampos() {
        document.querySelector('#nombre_animal').value = '';
        document.querySelector('#especie').value = '';
        document.querySelector('#edad').value = '';
        document.querySelector('#descripcion').value = '';
        document.querySelector('#foto_animal').value = '';
    }

    //Buscar por ID --> si es distinto a vacio
    btnBuscar.addEventListener('click', () => {
        const idABuscar = document.querySelector('#numero-id').value.trim();

        if (idABuscar !== '') {
            const animalEncontrado = animales.find(animal => animal.id_animal === parseInt(idABuscar));
            if (animalEncontrado) {
                mostrarAnimalEncontrado(animalEncontrado);
            } else {
                mostrarError('Animal no encontrado');
            }
        } else {
            mostrarError('Por favor, ingrese un ID para buscar.');
        }
    });

    function mostrarAnimalEncontrado(animalEncontrado) {
        Swal.fire({
            icon: 'success',
            title: 'Animal encontrado',
            html: `
                <b>ID Animal:</b> ${animalEncontrado.id_animal}<br>
                <b>Nombre Animal:</b> ${animalEncontrado.nombre_animal}<br>
                <b>Especie:</b> ${animalEncontrado.especie}<br>
                <b>Edad:</b> ${animalEncontrado.edad}<br>
                <b>Descripción:</b> ${animalEncontrado.descripcion}<br>
                <b>Foto Animal:</b> ${animalEncontrado.foto_animal}<br>
            `
        });
    }
    function validarDatosAnimales(nombre_animal, especie, edad, descripcion, foto_animal) {
        if (nombre_animal === '' || especie === '' || edad === '' || descripcion === '' || foto_animal === '') {
            mostrarError('Por favor, complete todos los campos.');
            return false;
        }

        if (nombre_animal.length > 10) {
            mostrarError('El nombre debe contener hasta 10 caracteres.');
            return false;
        }

        if (especie.length > 15) {
            mostrarError('La nombre de especie debe contener hasta 8 caracteres.');
            return false;
        }

        if (isNaN(edad) || edad < 0 || edad > 18) {
            mostrarError('La edad debe ser un número entre 0 y 18.');
            return false;
        }

        if (descripcion.length > 255) {  //CAMBIAR EL TIPO DE ESTE ATRIBUTO DE TXT A TINYTEXT
            mostrarError('La descripción debe contener hasta 255 caracteres.');
            return false;
        }

        if (foto_animal.length > 100) {
            mostrarError('La foto del animal............... .');
            return false;
        }

        // Si todas las validaciones pasan, retorna true para indicar que los datos son válidos.
        return true;
    }

    // Función para mostrar un error con SweetAlert para todos los campos
    function mostrarError(mensaje) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: mensaje
        });
    }

    // Funciones para mostrar diferentes tablas
    function mostrarAdopciones() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-adopciones').style.display = 'block';
    }

    function mostrarUsuarios() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-usuarios').style.display = 'block';
    }

    function mostrarArticulos() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-articulos').style.display = 'block';
    }
    document.getElementById('btn-articulos').addEventListener('click', mostrarArticulos);

    function mostrarAnimales() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-animales').style.display = 'block';
    }

    function mostrarDonaciones() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-donaciones').style.display = 'block';
    }
    document.getElementById('btn-donaciones').addEventListener('click', mostrarDonaciones);

    function mostrarVoluntarios() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-voluntarios').style.display = 'block';
    }
    document.getElementById('btn-voluntarios').addEventListener('click', mostrarVoluntarios);

    // Event listeners para los botones
    document.getElementById('btn-animales').addEventListener('click', mostrarAnimales);
    document.getElementById('btn-adopciones').addEventListener('click', mostrarAdopciones);
    document.getElementById('btn-usuarios').addEventListener('click', mostrarUsuarios);
    document.getElementById('btn-articulos').addEventListener('click', mostrarArticulos);
    document.getElementById('btn-donaciones').addEventListener('click', mostrarDonaciones);
    document.getElementById('btn-voluntarios').addEventListener('click', mostrarVoluntarios);

    // Para consultar antes de Cerrar Sesión
    const btnCerrarSesion = document.querySelector('a[href="../login.html"]');
    btnCerrarSesion.addEventListener('click', function (e) {
        e.preventDefault();
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: '¿Estás seguro de que quieres cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ffbe70',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "../index.html";
            }
        });
    });
    
});
