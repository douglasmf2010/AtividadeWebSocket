const dotenv = require('dotenv');
dotenv.config();
const ws = require('ws');
const Usuario = require('./src/models/user');

let server = new ws.Server({ port: 3001 });

let users = {};

server.on('connection', (client) => {
  client.on('close', () => {});
  client.on('message', async (message) => {
    let msgObject = JSON.parse(message);

    console.log(msgObject);
    if (msgObject.action == 'confirm_connection') {
      users[msgObject.user] = client;
      console.log(msgObject);
      console.log(users[msgObject.user]);
    } else if (msgObject.action == 'disconnect') {
      delete users[msgObject.user];
    } else if (msgObject.action == 'message') {
      const { sender, receiver, message } = msgObject;
      console.log(msgObject);
      console.log(users[receiver]);

      if (users[receiver] !== undefined) {
        users[receiver].send(
          JSON.stringify({
            action: 'message',
            sender: sender,
            message: message,
          }),
        );
      }
    } else if (msgObject.action == 'register') {
      const { usuario, telefone, senha } = msgObject;

      const user = await Usuario.findOne({
        where: {
          usuario: usuario,
        },
      });
      if (user) {
        client.send(
          JSON.stringify({
            action: 'register',
            success: false,
            message: 'Usuário já existe',
          }),
        );
      } else {
        let user = await Usuario.create({
          usuario: usuario,
          telefone: telefone,
          senha: senha,
        });
        await user.save();
      }
    } else if (msgObject.action == 'logar') {
      const { usuario, senha } = msgObject;
      
    }
  });
});
