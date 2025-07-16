// Llenar el select de artículos al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/donaciones/articulos');
    const articulos = await response.json();
    const select = document.createElement('select');
    select.id = 'nombre_articulo';
    select.className = 'swal2-input swal2-select';
    select.innerHTML = `<option value="">Seleccione un artículo</option>` +
        articulos.map(a => `<option value="${a.nombre_articulo}">${a.nombre_articulo}</option>`).join('');
    window.articulosSelectHTML = select.outerHTML;
});

document.getElementById('btn-donar').addEventListener('click', function () {
    Swal.fire({
        title: '¡Gracias por tu ayuda!',
        html: `
            <p>Por favor, completa tus datos para colaborar con artículos:</p>
            <input type="text" id="nombre_donador" class="swal2-input" placeholder="Nombre Donador">
            <input type="email" id="email" class="swal2-input" placeholder="Correo electrónico">
            ${window.articulosSelectHTML || '<input type="text" id="nombre_articulo" class="swal2-input" placeholder="Nombre del Artículo">'}
            <textarea id="detalles" class="swal2-textarea" placeholder="Descripción del Artículo"></textarea>
        `,
        background: '#fff8f5',
        color: '#6b2b2b',
        confirmButtonColor: '#8aceb5',
        confirmButtonText: 'Enviar',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        cancelButtonColor: '#e57373',
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById('nombre_donador').value.trim();
            const email = document.getElementById('email').value.trim();
            const articulo = document.getElementById('nombre_articulo').value;
            const detalles = document.getElementById('detalles').value.trim();

            const error = validarDonacionRapida({ nombre, email, articulo, detalles });
            if (error) {
                Swal.showValidationMessage(error);
                return false;
            }
            return { nombre, email, articulo, detalles };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Obtener la fecha actual en formato YYYY-MM-DD
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const fecha_donacion = `${yyyy}-${mm}-${dd}`;

            // Buscar el id_articulo por nombre
            let id_articulo = null;
            try {
                const res = await fetch('/donaciones/articulos');
                const articulos = await res.json();
                const articuloObj = articulos.find(a => a.nombre_articulo === result.value.articulo);
                id_articulo = articuloObj ? articuloObj.id_articulo : null;
            } catch (e) {}

            // Construir el body para el POST
            const body = {
                nombre_donador: result.value.nombre,
                email: result.value.email,
                descripcion: result.value.detalles,
                id_articulo: id_articulo,
                fecha_donacion
            };

            // Hacer el POST a la ruta de solicitudes pendientes
            try {
                const response = await fetch('/donaciones/solicitud', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    Swal.fire('Error', errorData.error || 'No se pudo registrar la donación.', 'error');
                    return;
                }
                Swal.fire('¡Gracias!', 'Tu solicitud fue enviada y está pendiente de aprobación.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            }
        }
    });
});

// Función de validación para la donación rápida
function validarDonacionRapida({ nombre, email, articulo, detalles }) {
    const nombreRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre) {
        return 'El nombre no puede estar en blanco.';
    }
    if (!nombreRegex.test(nombre)) {
        return 'El nombre solo puede contener letras y espacios.';
    }
    if (nombre.length < 3 || nombre.length > 30) {
        return 'El nombre debe tener entre 3 y 30 caracteres.';
    }
    if (!email) {
        return 'El email no puede estar en blanco.';
    }
    if (!emailRegex.test(email)) {
        return 'Ingrese un email válido.';
    }
    if (!detalles) {
        return 'La descripción no puede estar en blanco.';
    }
    if (detalles.length < 5 || detalles.length > 100) {
        return 'La descripción debe tener entre 5 y 100 caracteres.';
    }
    if (!articulo || articulo === "") {
        return 'Por favor, selecciona un artículo.';
    }
    return null; // Sin errores
}