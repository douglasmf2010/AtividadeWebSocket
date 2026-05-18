let server = null;
let currentUser = "";

const user = document.getElementById("user");
const telefone = document.getElementById("telefone");
const senha = document.getElementById("senha");

function cadastrar() {

    if(server && server.readyState === WebSocket.OPEN){

        currentUser = user.value;

        let obj = {
            action: 'register',
            usuario: user.value,
            telefone: telefone.value,
            senha: senha.value,
        };

        server.send(JSON.stringify(obj));

        user.value = currentUser;
    }
}

function logar() {

    if(server && server.readyState === WebSocket.OPEN){

        currentUser = user.value;

        let obj = {
            action: 'logar',
            usuario: user.value,
            senha: senha.value,
        };

        server.send(JSON.stringify(obj));

        user.value = currentUser;
    }
}

function serverConnect(){

    server = new WebSocket("ws://127.0.0.1:3001");

    server.onopen = () => {
        connect.classList.add("hidden");
        // disconnect.classList.remove("hidden");
    };

    server.onclose = () => {
        connect.classList.remove("hidden");
        // disconnect.classList.add("hidden");
    };

    server.onmessage = (sock) => {

        let data = JSON.parse(sock.data);

        if(data.action == "Who_is") {

            let json = {
                user: user.value,
                action: 'confirm_connection',
            };

            server.send(JSON.stringify(json));

       } 
    }
    // else if(data.action == 'message') {

    //         chatBox.insertAdjacentHTML(
    //             "beforeend",
    //             `<div class="received">
    //                 <small>
    //                     <label>${data.sender}</label>
    //                 </small>
    //                 <p>${data.message}</p>
    //             </div>`
    //         );
    //     }
    // };
}

function serverDisconnect(){

    if(server){

        server.send(JSON.stringify({
            action: 'disconnect',
            user: user.value
        }));

        server.close();
    }
}

function serverSend(){

    if(server && server.readyState === WebSocket.OPEN){

        let obj = {
            action: 'message',
            sender: user.value,
            receiver: receiver.value,
            message: message.value
        };

        server.send(JSON.stringify(obj));
    }
}