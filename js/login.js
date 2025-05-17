document.addEventListener('DOMContentLoaded', async () => {
    const select = document.getElementById('select-localidad');
    try {
        const res = await fetch('auth/localidades');
        const localidades = await res.json();
        localidades.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.id_localidad;
            option.textContent = loc.descripcion;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Error al cargar localidades', err);
    }
});