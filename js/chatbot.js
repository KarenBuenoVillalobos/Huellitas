let nombreUsuario = "";
let esperandoAyudaExtra = false;

const opciones = [
    { texto: "¿Cómo puedo donar?", clave: "donar" },
    { texto: "Quiero adoptar", clave: "adoptar" },
    { texto: "Horarios y contacto", clave: "contacto" },
    { texto: "Ser voluntario/a", clave: "voluntario" },
    { texto: "¿Dónde están ubicados?", clave: "ubicacion" }
];
const respuestas = {
    donar: 'Puedes donar escaneando el código QR, haciendo clic en "¡Quiero ayudar!" o usando los datos bancarios de la página.',
    adoptar: 'Navega en la sección de adopta y completa el formulario. Nos pondremos en contacto contigo.',
    contacto: 'Nuestro horario es de lunes a viernes de 9 a 18 hs. Puedes contactarnos por mail a <a href="mailto:huellitasdeamor.adm@gmail.com">huellitasdeamor.adm@gmail.com</a> o por redes sociales.',
    voluntario: 'Navega en la sección de contacto y completa el formulario para ser voluntario/a.',
    ubicacion: 'Estamos en Buenos Aires, Argentina. ¡Escríbenos para coordinar una visita!',
    otro: '¡Gracias por tu mensaje! Si tienes otra consulta, puedes escribirnos por mail o redes sociales.'
};

function mostrarOpciones() {
    const chat = document.getElementById('chat-messages');
    let html = `<div style="margin-bottom:8px;color:#e573b3;"><b>¿Sobre qué tema necesitas ayuda?</b></div>`;
    opciones.forEach(op => {
        html += `<button class="chat-opcion" data-clave="${op.clave}" style="margin:4px 4px 8px 0;padding:6px 12px;border-radius:16px;border:1px solid #e573b3;background:#fff;color:#e573b3;cursor:pointer;">${op.texto}</button>`;
    });
    chat.innerHTML += html;
    chat.scrollTop = chat.scrollHeight;
    document.querySelectorAll('.chat-opcion').forEach(btn => {
        btn.onclick = function() {
            agregarMensajeUsuario(this.innerText);
            responderBot(this.dataset.clave);
        };
    });
}

function agregarMensajeUsuario(msg) {
    const chat = document.getElementById('chat-messages');
    chat.innerHTML += `<div style="margin-bottom:4px;"><b>Tú:</b> ${msg}</div>`;
}

function preguntarAyudaExtra() {
    const chat = document.getElementById('chat-messages');
    chat.innerHTML += `<div style="margin-bottom:8px;"><b>Huellitas:</b> ¿Necesitás alguna ayuda más?</div>`;
    chat.scrollTop = chat.scrollHeight;
    esperandoAyudaExtra = true;
}

function responderBot(clave) {
    const chat = document.getElementById('chat-messages');
    chat.innerHTML += `<div style="margin-bottom:8px;"><b>Huellitas:</b> ${respuestas[clave] || respuestas.otro}</div>`;
    chat.scrollTop = chat.scrollHeight;
    setTimeout(preguntarAyudaExtra, 800);
}

document.getElementById('open-chat').onclick = function() {
    document.getElementById('chat-window').style.display = 'flex';
    this.style.display = 'none';
    document.getElementById('chat-messages').innerHTML = `<div style="margin-bottom:8px;color:#e573b3;"><b>¡Hola! ¿Cómo es tu nombre?</b></div>`;
    nombreUsuario = "";
    esperandoAyudaExtra = false;
};

document.getElementById('close-chat').onclick = function() {
    document.getElementById('chat-window').style.display = 'none';
    document.getElementById('open-chat').style.display = 'block';
};

document.getElementById('chat-form').onsubmit = function(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    agregarMensajeUsuario(msg);

    if (!nombreUsuario) {
        nombreUsuario = msg.split(" ")[0];
        const chat = document.getElementById('chat-messages');
        chat.innerHTML += `<div style="margin-bottom:8px;"><b>Huellitas:</b> ¡Mucho gusto, ${nombreUsuario}! ¿En qué podemos ayudarte?</div>`;
        chat.scrollTop = chat.scrollHeight;
        setTimeout(mostrarOpciones, 800);
    } else if (esperandoAyudaExtra) {
        if (msg.toLowerCase().includes("si")) {
            esperandoAyudaExtra = false;
            setTimeout(mostrarOpciones, 400);
        } else {
            const chat = document.getElementById('chat-messages');
            chat.innerHTML += `<div style="margin-bottom:8px;"><b>Huellitas:</b> ¡Gracias por tu visita, ${nombreUsuario}! Que tengas un gran día 🐾</div>`;
            chat.scrollTop = chat.scrollHeight;
            esperandoAyudaExtra = false;
            setTimeout(() => {
                document.getElementById('chat-window').style.display = 'none';
                document.getElementById('open-chat').style.display = 'block';
            }, 1800);
        }
    } else {
        let clave = Object.keys(respuestas).find(k => msg.toLowerCase().includes(k));
        responderBot(clave || "otro");
    }
    input.value = '';
};