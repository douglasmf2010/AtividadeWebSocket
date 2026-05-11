let server = null

function serverConnect(){ 
    server = new WebSocket("ws://127.0.0.1:3001")

    server.onopen = (evt) => {
        connect.classList.add("hidden")
        disconnect.classList.remove('hidden')
    }

    server.onclose = () => {
        connect.classList.remove("hidden")
        disconnect.classList.add('hidden')
    }

    server.onmessage = (sock) => {
        let data = JSON.parse(sock.data)

console.log(data.action == 'message')
        if(data.action == "Who_is") {
            let json = {
                user: user.value,
                action: 'confirm_connection',
            };
            server.send(JSON.stringify(json))
        }else if(data.action == 'message'){
        console.log(data);
            chatBox.innerHTML  += `<div class="received"><small><label>${data.sender}</label></small><p>${data.message}</p></div>`
        }
    }
}


function serverDisconnect() {
    if(server != null) {
        server.send(JSON.stringify({
            action: 'disconnet',
            user: user.value
        }))

        server.close()
    }
}

function serverSend(){
    if (server != null){
        let obj = {
            action: 'message',
            sender: user.value,
            receiver: receiver.value,
            message: message.value
        }

        server.send(JSON.stringify(obj));
    }
}
