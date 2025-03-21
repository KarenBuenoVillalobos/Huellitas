document.addEventListener('DOMContentLoaded', function () {
    const openModal = document.querySelector('.crear-abm');
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.modal__close');
    const tblListado = document.querySelector('.tbl-listado table');
    const btnBuscar = document.querySelector('#buscar-id');
    const btnEliminar = document.querySelector('#eliminar');
    let adopciones = []; // Array para almacenar los vehículos

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

    const btnCrear = document.querySelector('.btn__crear');
    btnCrear.addEventListener('click', (e) => {
        e.preventDefault();
        // Validaciones de los campos
        const id_usuario = document.querySelector('#id_usuario').value;
        const id_animal = document.querySelector('#id_animal').value;
        const telefono = document.querySelector('#telefono').value;
        const direccion = document.querySelector('#direccion').value;
        const fecha_adopcion = document.querySelector('#fecha_adopcion').value;

        //Paso los datos a una funcion que me valida los datos
        const validar = validarDatosAdopciones(id_usuario, id_animal, telefono, direccion, fecha_adopcion);
        //Si el valor es TRUE me agrega el vehiculo
        if (validar == true) {
            // Crear el objeto de vehículo
            const id_adopcion = adopciones.length + 1; // Generar un ID autoincremental
            const nuevaAdopcion = {
                id_adopcion: id_adopcion,
                id_usuario: id_usuario,
                id_animal: id_animal,
                telefono: parseInt(telefono),
                direccion: direccion,
                fecha_adopcion: fecha_adopcion,
            };

            // Agregar el nuevo vehículo al array
            adopciones.push(nuevaAdopcion);

            // Actualizar la tabla
            actualizarTabla();

            // Limpiar los campos del formulario
            limpiarCampos();

            // Cerrar el modal
            modal.classList.remove('modal--show');
        }

    });

    // Función para actualizar la tabla con los datos de vehículos
    function actualizarTabla() {
        // Limpiar la tabla
        tblListado.innerHTML = `
            <tr>
                <th>ID Adopción</th>
                <th>ID Usuario</th>
                <th>ID Animal</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Fecha Adopción</th>
            </tr>
        `;

        // Agregar cada vehículo a la tabla
        adopciones.forEach(adopcion => {
            tblListado.innerHTML += `
                <tr>
                    <td>${adopcion.id_adopcion}</td>
                    <td>${adopcion.id_usuario}</td>
                    <td>${adopcion.id_animal}</td>
                    <td>${adopcion.telefono}</td>
                    <td>${adopcion.direccion}</td>
                    <td>${adopcion.fecha_adopcion}</td>
                    <td><button class="btn-modificar" data-id="${adopcion.id_adopcion}"></button><button class="btn-eliminar" data-id="${adopcion.id_adopcion}"></button></td>
                </tr>
            `;
        });

        // Agregar event listener a los botones de modificar
        document.querySelectorAll('.btn-modificar').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                cargarAdopcionParaModificar(id);
            });
        });

        // Agregar el event listener a los botones de eliminar
        document.querySelectorAll('.btn-eliminar').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                eliminarAdopcion(id);
            });
        });
    }

    function cargarAdopcionParaModificar(id_adopcion) {
        const adopcion = adopciones.find(adop => adop.id_adopcion === id_adopcion);
        if (adopcion) {
            document.querySelector('#id_usuario').value = adopcion.id_usuario;
            document.querySelector('#id_animal').value = adopcion.id_animal;
            document.querySelector('#telefono').value = adopcion.telefono;
            document.querySelector('#direccion').value = adopcion.direccion;
            document.querySelector('#fecha_adopcion').value = adopcion.fecha_adopcion;

            // Abrir el modal
            modal.classList.add('modal--show');

            // Cambiar el texto del botón crear por "Guardar cambios"
            const btnCrear = document.querySelector('.btn__crear');
            btnCrear.textContent = 'Guardar cambios';

            // Remover event listeners anteriores para evitar múltiples listeners
            btnCrear.replaceWith(btnCrear.cloneNode(true));
            const newBtnCrear = document.querySelector('.btn__crear');

            newBtnCrear.addEventListener('click', (e) => {
                e.preventDefault();
                guardarCambios(id);
            });
        }
    }

    function guardarCambios(id_adopcion) {
        // Obtener los datos modificados del formulario
        const id_usuario = document.querySelector('#id_usuario').value;
        const id_animal = document.querySelector('#id_animal').value;
        const telefono = document.querySelector('#telefono').value;
        const direccion = document.querySelector('#direccion').value;
        const fecha_adopcion = document.querySelector('#fecha_adopcion').value;

        //Paso los datos a una funcion que me valida los datos
        const validar = validarDatosAdopciones(id_usuario, id_animal, telefono, direccion, fecha_adopcion);
    
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
                    // Actualizar el vehículo en el array
                    const adopcion = adopciones.find(adop => adop.id_adopcion === id_adopcion);
                    if (adopcion) {
                        adopcion.id_usuario = id_usuario;
                        adopcion.id_animal = id_animal;
                        adopcion.telefono = parseInt(telefono);
                        adopcion.direccion = direccion;
                        adopcion.fecha_adopcion = fecha_adopcion;
    
                        // Actualizar la tabla
                        actualizarTabla();
    
                        // Limpiar los campos del formulario
                        limpiarCampos();
    
                        // Cerrar el modal
                        modal.classList.remove('modal--show');
    
                        // Restaurar el texto del botón a "Crear"
                        const btnCrear = document.querySelector('.btn__crear');
                        btnCrear.textContent = 'Crear';
                    }
                }
            });
        }
    }
    

    // Función para eliminar un vehículo
    function eliminarAdopcion(id_adopcion) {
        // Mostrar confirmación con swal
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Quieres eliminar este vehículo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffbe70",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Eliminar el vehículo del array
                adopciones = adopciones.filter(adopcion => adopcion.id_adopcion !== id_adopcion);
    
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
        document.querySelector('#id_usuario').value = '';
        document.querySelector('#id_animal').value = '';
        document.querySelector('#telefono').value = '';
        document.querySelector('#direccion').value = '';
        document.querySelector('#fecha_adopcion').value = '';
    }

    //Buscar por ID --> si es distinto a vacio
    btnBuscar.addEventListener('click', () => {
        const idABuscar = document.querySelector('#numero-id').value.trim();

        if (idABuscar !== '') {
            const adopcionEncontrada = adopciones.find(adopcion => adopcion.id_adopcion === parseInt(idABuscar));
            if (adopcionEncontrada) {
                mostrarAdopcionEncontrada(adopcionEncontrada);
            } else {
                mostrarError('Adopción no encontrada.');
            }
        } else {
            mostrarError('Por favor, ingrese un ID para buscar.');
        }
    });

    function mostrarAdopcionEncontrada(adopcionEncontrada) {
        Swal.fire({
            icon: 'success',
            title: 'Adopción encontrada.',
            html: `
                <b>ID Adopción:</b> ${adopcionEncontrada.id_adopcion}<br>
                <b>ID Usuario:</b> ${adopcionEncontrada.id_usuario}<br>
                <b>ID Animal:</b> ${adopcionEncontrada.id_animal}<br>
                <b>Teléfono:</b> ${adopcionEncontrada.telefono}<br>
                <b>Dirección:</b> ${adopcionEncontrada.direccion}<br>
                <b>Fecha Adopción:</b> ${adopcionEncontrada.fecha_adopcion}<br>
            `
        });
    }
    function validarDatosAdopciones(id_usuario, id_animal, telefono, direccion, fecha_adopcion) {
        if (id_usuario === '' || id_animal === '' || telefono === '' || direccion === '' || fecha_adopcion === '') {
            mostrarError('Por favor, complete todos los campos.');
            return false;
        }

        if (!/^[a-zA-Z0-9]{1,6}$/.test(id_usuario)) { //ARREGLAR
            mostrarError('La matrícula debe contener hasta 6 caracteres alfanuméricos.');
            return false;
        }

        if (!/^[a-zA-Z\s]{1,8}$/.test(id_animal)) { //ARREGLAR
            mostrarError('El grupo debe contener hasta 8 caracteres y solo letras.');
            return false;
        }

        if (telefono.length > 10) {
            mostrarError('El teléfono debe contener hasta 10 números.');
            return false;
        }

        if (!/^[a-zA-Z0-9]{1,40}$/.test(direccion)) {
            mostrarError('La dirección debe contener hasta 40 caracteres alfanuméricos.');
            return false;
        }

        if (!/^[a-zA-Z\s]{1,12}$/.test(fecha_adopcion)) { //ARREGLAR
            mostrarError('La marca debe contener hasta 12 caracteres y solo letras.');
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


    // Para el desplazamiento del menú de tablas cuando hago click en el botón Servicios
    // document.getElementById('btn-servicios').addEventListener('click', function (event) {
    //     event.preventDefault();
    //     var opciones = document.getElementById('opciones-servicios');
    //     if (!opciones.classList.contains('visible')) {
    //         opciones.style.display = 'flex';
    //         setTimeout(function () {
    //             opciones.classList.add('visible');
    //         }, 10); // Pequeño retraso para permitir el cambio de display antes de la transición
    //     } else {
    //         opciones.classList.remove('visible');
    //         setTimeout(function () {
    //             opciones.style.display = 'none';
    //         }, 500); // Esperar a que la transición termine antes de ocultar
    //     }
    // });

    // Funciones para mostrar diferentes tablas
    function mostrarAdopciones() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-adopciones').style.display = 'block';
        contenidoDinamico.innerHTML = `
        <table>
            <tr>
                <th>ID Adopción</th>
                <th>ID Usuario</th>
                <th>ID Animal</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Fecha Adopción</th>
            </tr>
        </table>
    `;
    }

    function mostrarAnimales() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-animales').style.display = 'block';
        contenidoDinamico.innerHTML = `
        <table>
            <tr>
                <th>ID Animal</th>
                <th>Nombre Animal</th>
                <th>Especie</th>
                <th>Edad</th>
                <th>Descripción</th>
                <th>Foto Animal</th>
            </tr>
        </table>
    `;
    }

    function mostrarArticulos() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-articulos').style.display = 'block';
        contenidoDinamico.innerHTML = `
        <table>
            <tr>
                <th>ID Artículo</th>
                <th>Nombre Artículo</th>
                <th>Detalles</th>
            </tr>
        </table>
    `;
    }
    document.getElementById('btn-articulos').addEventListener('click', mostrarArticulos);

    function mostrarDonaciones() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-donaciones').style.display = 'block';
        contenidoDinamico.innerHTML = `
        <table>
            <tr>
                <th>ID Donación</th>
                <th>ID Usuario</th>
                <th>ID Artículo</th>
                <th>Fecha Donación</th>
            </tr>
            <!-- Agrega aquí las filas de la tabla -->
        </table>
    `;
    }

    function mostrarUsuarios() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-usuarios').style.display = 'block';
        contenidoDinamico.innerHTML = `
        <table>
            <tr>
                <th>ID Usuario</th>
                <th>Nombre Apellido</th>
                <th>Email</th>
                <th>Localidad</th>
                <th>Género</th>
                <th>Password</th>
                <th>Foto Usuario</th>
            </tr>
        </table>
    `;
    }
    document.getElementById('btn-usuarios').addEventListener('click', mostrarUsuarios);

    function mostrarVoluntarios() {
        document.querySelectorAll('.tbl-listado').forEach(tabla => {
            tabla.style.display = 'none';
        });
        document.getElementById('tabla-voluntarios').style.display = 'block';
        contenidoDinamico.innerHTML = `
        <table>
            <tr>
                <th>ID Voluntario</th>
                <th>Asignación</th>
                <th>Tarea</th>
            </tr>
        </table>
    `;
    }
    document.getElementById('btn-voluntarios').addEventListener('click', mostrarVoluntarios);

    // Event listeners para los botones
    document.getElementById('btn-adopciones').addEventListener('click', mostrarAdopciones);
    document.getElementById('btn-animales').addEventListener('click', mostrarAnimales);
    document.getElementById('btn-articulos').addEventListener('click', mostrarArticulos);
    document.getElementById('btn-donaciones').addEventListener('click', mostrarDonaciones);
    document.getElementById('btn-usuarios').addEventListener('click', mostrarUsuarios);
    document.getElementById('btn-voluntarios').addEventListener('click', mostrarVoluntarios);

    // // Para consultar antes de Cerrar Sesión
    // const btnCerrarSesion = document.querySelector('a[href="/registro.html"]');
    // btnCerrarSesion.addEventListener('click', function (e) {
    //     e.preventDefault();
    //     Swal.fire({
    //         title: '¿Cerrar sesión?',
    //         text: '¿Estás seguro de que quieres cerrar sesión?',
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#ffbe70',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Sí, cerrar sesión',
    //         cancelButtonText: 'Cancelar'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             window.location.href = "/index.html";
    //         }
    //     });
    // });
    
});
