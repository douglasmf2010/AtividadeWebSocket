const ws = require('ws');

let server = new ws.Server({port: 3001});

let users = {}

server.on("connection", (client) => {
    client.on("close", () => { });
    client.on("message", (message) => {
        let msgObject = JSON.parse(message)
       
            console.log(msgObject)
        if(msgObject.action == 'confirm_connection') {
            users[msgObject.user] = client
            console.log(msgObject)
            console.log(users[msgObject.user])
        }else if(msgObject.action == 'disconnect') {
            delete users [msgObject.user];
        }else if(msgObject.action == 'message') {
            const { sender, receiver, message } = msgObject;
            console.log(msgObject)
             console.log(users[receiver])

            if(users[receiver] !== undefined) {
                users[receiver].send(
                    JSON.stringify({
                        action: 'message',
                        sender: sender,
                        message: message
                }))
            }
        }
    });

    client.send(JSON.stringify({connetion: true, action: 'Who_is'}))
})