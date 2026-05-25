let server = null;
let currentUser = '';
let currentSala = '';

const user = document.getElementById('user-login');
const usercadastro = document.getElementById('user');
const telefone = document.getElementById('telefone');
const senha = document.getElementById('senha');
const message = document.getElementById('mensagem');

function serverConnect() {
  server = new WebSocket('ws://127.0.0.1:3001');

  server.onopen = () => {
    connect.classList.add('hidden');
    // disconnect.classList.remove("hidden");
  };

  server.onclose = () => {
    connect.classList.remove('hidden');
    // disconnect.classList.add("hidden");
  };

  server.onmessage = (sock) => {
    let data = JSON.parse(sock.data);
    console.log(data);
    console.log(data.action == 'atualizarsala');

    if (data.action == 'Who_is') {
      let json = {
        user: user.value,
        action: 'confirm_connection',
      };

      server.send(JSON.stringify(json));
    } else if (data.action == 'atualizarsala') {
      let salaslist = document.getElementById('salas-list');
      salaslist.innerHTML = '';
      for (let i = 0; i < data.salas.length; i++) {
        console.log('qualquer coisa');
        salaslist.innerHTML += `
        <button type="button" class="salas"
        onclick="entrarSala('${data.salas[i]}')"
        >${data.salas[i]}</button>`;
      }
    } else if (data.action == 'atualizaruser') {
      let userslist = document.getElementById('users-list');
      userslist.innerHTML = ''
      for (let i = 0; i < data.users.length; i++) {
        console.log('qualquer coisa');
        userslist.innerHTML += `<p>${data.users[i]}</p>`;
      }
    } else if (data.action == 'message') {
      let messageslist = document.getElementById('messages');
      messageslist.innerHTML += `
      <p>${data.sender}</p>
      <p>${data.message}</p>
      `;
      // chatBox.insertAdjacentHTML(
      //   'beforeend',
      //   `<div class="received">
      //             <small>
      //                 <label>${data.sender}</label>
      //             </small>
      //             <p>${data.message}</p>
      //         </div>`,
      // );
    }
  };
  // salaslist.innerHTML += `
  //   <button type="button" class="salas">${nomesala}</button>`;
}

function cadastrar() {
  if (server && server.readyState === WebSocket.OPEN) {
    currentUser = usercadastro.value;

    let obj = {
      action: 'register',
      usuario: usercadastro.value,
      telefone: telefone.value,
      senha: senha.value,
    };

    server.send(JSON.stringify(obj));

    usercadastro.value = currentUser;
  } else {
    alert('ERRO você não esta conectado');
  }
}

function logar() {
  //   serverConnect();
  if (server && server.readyState === WebSocket.OPEN) {
    currentUser = user.value;

    let obj = {
      action: 'logar',
      usuario: document.getElementById('user-login').value,
      senha: document.getElementById('senha-login').value,
    };

    server.send(JSON.stringify(obj));

    user.value = currentUser;
  } else {
    alert('ERRO você não esta conectado');
  }
}

function criarSala() {
  let nomesala = prompt('Qual o nome da sala');

  if (server && server.readyState === WebSocket.OPEN) {
    currentUser = user.value;

    let obj = {
      action: 'criarsalas',
      nome: nomesala,
    };

    server.send(JSON.stringify(obj));
  } else {
    alert('ERRO você não esta conectado');
  }
}
function entrarSala(nomesala) {
  currentSala = nomesala;
  let obj = {
      action: 'entrarSala',
      sala: nomesala,
      user: user.value
    };

    server.send(JSON.stringify(obj));
}

function serverDisconnect() {
  if (server) {
    server.send(
      JSON.stringify({
        action: 'disconnect',
        user: user.value,
      }),
    );

    server.close();
  }
}

function enviarMensagem() {
  console.log('se tiver vivo diga \x1b[32m"Dugas"\x1b[0m');
  if (server && server.readyState === WebSocket.OPEN) {
    let obj = {
      action: 'message',
      sender: user.value,
      sala: currentSala,
      message: message.value,
    };
    console.log(`${user} enviou "${message}"`);

    server.send(JSON.stringify(obj));
  }
}
