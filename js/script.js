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
    ${isLogged ? '<a href="#" id="logout-link"><img src="/img/icon-logout.png" alt="log-out"></a>' : ''}
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

let footer = '<a href="https://www.facebook.com" target="_blank"><img src="/img/ico-facebook.ico" alt="Facebook"></a><a href="https://www.instagram.com" target="_blank"><img src="/img/ico-instagram.ico" alt="Instagram"></a><a href="https://www.whatsapp.com" target="_blank"><img src="/img/ico-whatsapp.ico" alt="WhatsApp"></a><a href="https://www.twitter.com" target="_blank"><img src="/img/ico-twitter.ico" alt="Twitter"></a><a href="https://www.youtube.com" target="_blank"><img src="/img/ico-youtube.ico" alt="Youtube"></a><p>Derechos reservados © 2024</p><p>Terminos y condiciones</p><a href="/admin">Administración</a><p>Soporte</p>';
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
document.addEventListener('DOMContentLoaded', () => {
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
});
