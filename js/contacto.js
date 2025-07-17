document.addEventListener('DOMContentLoaded', async () => {
    // Llenar el select de asignaciones
    try {
        const response = await fetch('/voluntarios/asignaciones');
        if (!response.ok) throw new Error('Error al obtener asignaciones');
        const asignaciones = await response.json();
        const select = document.getElementById('asignacion');
        asignaciones.forEach(asignacion => {
            const option = document.createElement('option');
            option.value = asignacion.id_asignacion;
            option.textContent = asignacion.nombre_asignacion;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar asignaciones:', error);
    }

    // Enviar el formulario usando JSON
    const form = document.querySelector('form.contacto');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Validar campos
        const email = form.email.value.trim();
        const id_asignacion = form.id_asignacion.value;
        const tarea = form.tarea.value.trim();

        if (!email || !id_asignacion || !tarea) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.',
                confirmButtonColor: '#8aceb5'
            });
            return;
        }

        try {
            const response = await fetch('/voluntarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, id_asignacion, tarea })
            });
            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: '¡Solicitud enviada!',
                    text: 'Gracias por sumarte como voluntario. Nos pondremos en contacto pronto.',
                    icon: 'success',
                    confirmButtonColor: '#8aceb5'
                });
                form.reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al enviar la solicitud.',
                    confirmButtonColor: '#8aceb5'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al enviar la solicitud.',
                confirmButtonColor: '#8aceb5'
            });
        }
    });
});