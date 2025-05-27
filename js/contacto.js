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

    // Enviar el formulario usando FormData
    const form = document.querySelector('form.contacto');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        // Validación simple
        if (
            !formData.get('email') ||
            !formData.get('id_asignacion') ||
            !formData.get('tarea')
        ) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            const response = await fetch('/voluntarios', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                alert('¡Solicitud enviada correctamente!');
                form.reset();
            } else {
                alert(data.error || 'Error al enviar la solicitud.');
            }
        } catch (error) {
            alert('Error al enviar la solicitud.');
        }
    });
});