// Manejar el envío del formulario
const form = document.getElementById('especieForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que se recargue la página

    const formData = new FormData(form);
    const data = { nombre_especie: formData.get('nombre_especie') };

    try {
        const response = await fetch('/especies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
            return;
        }

        alert('Especie registrada con éxito');
        form.reset(); // Limpiar el formulario
    } catch (error) {
        console.error('Error al registrar la especie:', error);
        alert('Error al registrar la especie. Intente más tarde.');
    }
});