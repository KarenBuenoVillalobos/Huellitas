let idRol = localStorage.getItem('id_rol');
let isLogged = !!localStorage.getItem('token');
let nombre = localStorage.getItem('nombre');
let foto = localStorage.getItem('foto');

if (foto === 'undefined' || !foto) {
    foto = '';
}
let userInfo = '';
if (isLogged && nombre) {
    userInfo = `
        <span class="user-info">
            ${foto ? `<img src="/uploads/usuario/${foto}" alt="Foto de usuario" class="user-photo">` : ''}
            <span class="user-name">${nombre}</span>
        </span>
    `;
}

let header = `
<a href="/" class="logo"><img id="logo" src="/img/logo.png" alt="huellitas-de-amor"></a>
<input type="checkbox" id="check">
<label for="check" class="mostrar-menu">&#8801</label>
<nav class="menu">
    <a href="/">Home</a>
    <a href="/nosotros">Nosotros</a>
    <a href="/adopta">Adopta</a>
    <a href="/contacto">Contacto</a>
    <a href="/donar">Donar</a>
    ${isLogged ? '' : '<a href="/loginsesion">Iniciar Sesión</a>'}
    ${idRol === '1' ? '<a href="/admin" id="admin-link">Lista</a>' : ''}
    ${userInfo}
    ${isLogged ? '<a href="#" id="logout-link"><img src="/img/icon-exit.svg" alt="log-out" width="25"></a>' : ''}
    ${idRol === '1' ? '<a href="#" id="notification-link"><img src="/img/icon-notificacion.svg" alt="icon-notificacion" class="icon-notificacion" width="25"></a>' : ''}
    <label for="check" class="esconder-menu">&#215</label>
</nav>
`;

const headerElem = document.getElementById('header');
if (headerElem) {
    headerElem.innerHTML = header;

    // Evento para cerrar sesión con SweetAlert2
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            Swal.fire({
                title: '¿Desea cerrar sesión?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('id_rol');
                    localStorage.removeItem('nombre');
                    localStorage.removeItem('foto');
                    window.location.href = '/loginsesion'; // Redirige al login
                }
            });
        });
    }
}

let footer = '<a href="https://www.facebook.com" target="_blank"><img src="/img/ico-facebook.ico" alt="Facebook"></a><a href="https://www.instagram.com" target="_blank"><img src="/img/ico-instagram.ico" alt="Instagram"></a><a href="https://www.whatsapp.com" target="_blank"><img src="/img/ico-whatsapp.ico" alt="WhatsApp"></a><a href="https://www.twitter.com" target="_blank"><img src="/img/ico-twitter.ico" alt="Twitter"></a><a href="https://www.youtube.com" target="_blank"><img src="/img/ico-youtube.ico" alt="Youtube"></a><p>Derechos reservados © 2024</p><p>Terminos y condiciones</p><p>Soporte</p>';
const footerElem = document.getElementById('footer');
if (footerElem) {
    footerElem.innerHTML = footer;
}

/* POPUP */
function togglePopup(element) {
    const popup = element.closest('.foto-huellita').querySelector('.popup');
    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'block'; // Muestra el popup
    } else {
        popup.style.display = 'none'; // Oculta el popup
    }
}

/* LOGIN / REGISTRO */
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector(".container");
    const btnSignIn = document.getElementById("btn-sign-in");
    const btnSignUp = document.getElementById("btn-sign-up");

    if (btnSignIn && btnSignUp && container) {
        btnSignIn.addEventListener('click', () => {
            container.classList.remove('toggle');
        });

        btnSignUp.addEventListener('click', () => {
            container.classList.add('toggle');
        });
    }

    // --- ADMIN: Badge de notificaciones pendientes ---
    const notificationLink = document.getElementById('notification-link');
    if (notificationLink) {
        try {
            const response = await fetch('/donaciones/pendientes');
            if (response.ok) {
                const pendientes = await response.json();
                if (pendientes.length > 0) {
                    let badge = document.createElement('span');
                    badge.textContent = pendientes.length;
                    badge.className = 'notification-badge';
                    notificationLink.style.position = 'relative';
                    badge.style.position = 'absolute';
                    badge.style.top = '-5px';
                    badge.style.right = '-5px';
                    badge.style.background = 'red';
                    badge.style.color = 'white';
                    badge.style.borderRadius = '50%';
                    badge.style.padding = '2px 6px';
                    badge.style.fontSize = '12px';
                    badge.style.zIndex = '10';
                    notificationLink.appendChild(badge);
                }
            }
        } catch (e) {
            // No mostrar nada si hay error
        }

        // --- ADMIN: Notificaciones de solicitudes pendientes ---
        notificationLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/donaciones/pendientes');
                if (!response.ok) throw new Error('No se pudo obtener las solicitudes.');
                const pendientes = await response.json();

                if (!pendientes.length) {
                    Swal.fire('Solicitudes', 'No hay solicitudes de donación pendientes.', 'info');
                    return;
                }

                // Muestra todas las solicitudes pendientes
                let html = '<ul style="text-align:left;">';
                pendientes.forEach((d, idx) => {
                    let fecha = d.fecha_donacion ? d.fecha_donacion.split('T')[0] : '';
                    html += `
                        <li style="margin-bottom:10px;">
                            <b>${d.nombre_donador}</b> (${d.email})<br>
                            Artículo: ${d.nombre_articulo}<br>
                            Descripción: ${d.descripcion}<br>
                            Fecha: ${fecha}<br>
                            <button class="btn-aceptar" data-id="${d.id_donacion}" 
                                style="margin-right:8px; background:#8aceb5; color:#6b2b2b; border:none; border-radius:4px; padding:4px 12px; cursor:pointer;">
                                Aceptar
                            </button>
                            <button class="btn-rechazar" data-id="${d.id_donacion}" 
                                style="background:#e57373; color:#fff8f5; border:none; border-radius:4px; padding:4px 12px; cursor:pointer;">
                                Rechazar
                            </button>
                        </li>
                    `;
                });
                html += '</ul>';

                Swal.fire({
                    title: 'Solicitudes pendientes',
                    html,
                    width: 600,
                    showConfirmButton: false,
                    background: '#fff8f5',
                    didOpen: () => {
                        document.querySelectorAll('.btn-aceptar').forEach(btn => {
                            btn.addEventListener('click', async function () {
                                const id = this.getAttribute('data-id');
                                const li = this.closest('li');
                                await actualizarEstadoDonacion(id, 'aceptada');
                                if (li) li.remove();
                            });
                        });
                        document.querySelectorAll('.btn-rechazar').forEach(btn => {
                            btn.addEventListener('click', async function () {
                                const id = this.getAttribute('data-id');
                                const li = this.closest('li');
                                await actualizarEstadoDonacion(id, 'rechazada');
                                if (li) li.remove();
                            });
                        });
                    }
                });
            } catch (error) {
                Swal.fire('Error', 'No se pudieron cargar las solicitudes.', 'error');
            }
        });
    }
});

// Función para actualizar el estado de la donación (aceptar/rechazar)
async function actualizarEstadoDonacion(id, nuevoEstado) {
    try {
        const response = await fetch(`/donaciones/${id}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if (!response.ok) throw new Error();
        await Swal.fire('Listo', `Solicitud ${nuevoEstado === 'aceptada' ? 'aceptada' : 'rechazada'} correctamente.`, 'success');
    } catch {
        Swal.fire('Error', 'No se pudo actualizar la solicitud.', 'error');
    }
}