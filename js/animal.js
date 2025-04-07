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

        animales.forEach(animal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${animal.id_animal}</td>
                <td>${animal.nombre_animal}</td>
                <td>${animal.nombre_especie}</td>
                <td>${animal.edad}</td>
                <td>${animal.descripcion}</td>
                <td><img src="/uploads/${animal.foto_animal}" alt="Foto" width="50"></td>
            `;
            tbody.appendChild(row);
        });

        tabla.style.display = 'table'; // Mostrar la tabla
    } catch (error) {
        console.error('Error al cargar los animales:', error);
    }
});