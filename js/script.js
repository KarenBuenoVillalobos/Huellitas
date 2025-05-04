let header = '<a href="/" class="logo"><img id="logo" src="/img/logo.png" alt="huellitas-de-amor"></a><input type="checkbox" id="check"><label for="check" class="mostrar-menu">&#8801</label><nav class="menu"><a href="/">Home</a><a href="/nosotros">Nosotros</a><a href="/adopta">Adopta</a><a href="/contacto">Contacto</a><a href="/donar">Donar</a><a href="/loginsesion">Iniciar Sesión</a><label for="check" class="esconder-menu">&#215</label></nav>';
document.getElementById('header').innerHTML = header;

//<a href="listado.html">Listado</a>

let footer = '<a href="https://www.facebook.com" target="_blank"><img src="/img/ico-facebook.ico" alt="Facebook"></a><a href="https://www.instagram.com" target="_blank"><img src="/img/ico-instagram.ico" alt="Instagram"></a><a href="https://www.whatsapp.com" target="_blank"><img src="/img/ico-whatsapp.ico" alt="WhatsApp"></a><a href="https://www.twitter.com" target="_blank"><img src="/img/ico-twitter.ico" alt="Twitter"></a><a href="https://www.youtube.com" target="_blank"><img src="/img/ico-youtube.ico" alt="Youtube"></a><p>Derechos reservados © 2024</p><p>Terminos y condiciones</p><a href="/admin">Administración</a><p>Soporte</p>';
document.getElementById('footer').innerHTML = footer;

// let adminheader = '<a href="index.html" class="logo"><img id="logo" src="img/logo.png" alt="huellitas-de-amor"></a><input type="checkbox" id="check"><label for="check" class="mostrar-menu">&#8801</label><nav class="menu"><a href="index.html">Home</a><a href="listado.html">Listado</a><a href="iniciar-sesion.html">Iniciar Sesión</a><label for="check" class="esconder-menu">&#215</label></nav>';
// document.getElementById('adminheader').innerHTML = adminheader;

//-----------------------------------------------

/* POPUP */

function togglePopup(element) {
  const popup = element.closest('.foto-huellita').querySelector('.popup');
  if (popup.style.display === 'none' || popup.style.display === '') {
      popup.style.display = 'block'; // Muestra el popup
  } else {
      popup.style.display = 'none'; // Oculta el popup
  }
}

//-----------------------------------------------

/* LOGIN / REGISTRO */

const container = document.querySelector(".container");
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");

btnSignIn.addEventListener('click', () => {
  container.classList.remove('toggle');
});

btnSignUp.addEventListener('click', () => {
  container.classList.add('toggle');
});

//-----------------------------------------------
