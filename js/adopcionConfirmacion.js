// Función para guardar el nombre del animal en el localStorage (llámala desde adopta.html)
function guardarNombreAnimal(nombre) {
    localStorage.setItem('nombre_animal', nombre);
}

// Al cargar el formulario, poner el nombre del animal si existe en localStorage
document.addEventListener('DOMContentLoaded', () => {
    const nombreAnimal = localStorage.getItem('nombre_animal');
    if (nombreAnimal) {
        const inputNombreAnimal = document.getElementById('nombre_animal');
        if (inputNombreAnimal) {
            inputNombreAnimal.value = nombreAnimal;
        }
    }

    // Enviar el formulario por AJAX con validación
    const form = document.getElementById('formulario');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!validarFormulario()) return;

            // Recolectar los datos
            const data = {
                nombre_apellido: document.getElementById('nombre_apellido').value.trim(),
                nombre_animal: document.getElementById('nombre_animal').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                direccion: document.getElementById('direccion').value.trim(),
                fecha_adopcion: document.getElementById('fecha-adopcion').value
            };

            try {
                const response = await fetch('/adopciones/form-adopcion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "¡Solicitud enviada!",
                        text: "Tu solicitud de adopción fue registrada correctamente."
                    });
                    form.reset();
                } else {
                    // Si el backend responde que el usuario no existe, muestra la alerta específica
                    if (result.error && result.error.includes("usuario no existe")) {
                        Swal.fire({
                            icon: "warning",
                            title: "Debes registrarte",
                            text: "El usuario no existe. Debe registrarse en el sistema antes de adoptar."
                        }).then(() => {
                            // Redirigir al usuario a la página de registro
                            window.location.href = "/loginsesion";
                        },5000);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: result.error || "Ocurrió un error al registrar la adopción."
                        });
                    }
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo conectar con el servidor."
                });
            }
        });
    }
});

// Validación de formulario
function validarFormulario() {
    const nombre_apellido = document.getElementById('nombre_apellido').value.trim();
    const nombre_animal = document.getElementById('nombre_animal').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const fecha_adopcion = document.getElementById('fecha-adopcion').value;

    // Nombre del adoptante
    if (!nombre_apellido) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, ingresa el nombre del adoptante." });
        return false;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/.test(nombre_apellido)) {
        Swal.fire({ icon: "error", title: "Nombre inválido", text: "El nombre del adoptante solo puede contener letras y espacios (2-50 caracteres)." });
        return false;
    }

    // Nombre del animal
    if (!nombre_animal) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, ingresa el nombre del animal." });
        return false;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/.test(nombre_animal)) {
        Swal.fire({ icon: "error", title: "Nombre inválido", text: "El nombre del animal solo puede contener letras y espacios (2-50 caracteres)." });
        return false;
    }

    // Teléfono
    if (!telefono) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, ingresa un teléfono." });
        return false;
    }
    if (!/^\d{10}$/.test(telefono)) {
        Swal.fire({ icon: "error", title: "Teléfono inválido", text: "El teléfono debe tener exactamente 10 números." });
        return false;
    }

    // Domicilio
    if (!direccion) {
        Swal.fire({ icon: "error", title: "Campo requerido", text: "Por favor, ingresa una dirección." });
        return false;
    }
    if (direccion.length > 50) {
        Swal.fire({ icon: "error", title: "Dirección demasiado larga", text: "La dirección no puede exceder los 50 caracteres." });
        return false;
    }

    // Fecha
    const partes = fecha_adopcion.split('-');
    const fechaIngresada = new Date(partes[0], partes[1] - 1, partes[2]);
    fechaIngresada.setHours(0,0,0,0);

    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    const unaSemanaDespues = new Date(hoy);
    unaSemanaDespues.setDate(hoy.getDate() + 7);
    unaSemanaDespues.setHours(0,0,0,0);

    // Ahora la comparación es incluyente
    if (fechaIngresada < hoy) {
        Swal.fire({ icon: "error", title: "Fecha inválida", text: "La fecha no puede ser anterior a hoy." });
        return false;
    }
    if (fechaIngresada > unaSemanaDespues) {
        Swal.fire({ icon: "error", title: "Fecha inválida", text: "Solo puedes elegir una fecha hasta 7 días desde hoy." });
        return false;
    }
    return true;
}