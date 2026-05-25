const dotenv = require('dotenv');
dotenv.config();
const ws = require('ws');
const Usuario = require('./src/models/user');
const Sala = require('./src/models/sala');

let server = new ws.Server({ port: 3001 });

let users = {};
let salas = {};
Sala.findAll({}).then((data) => {
  for (let i = 0; i < data.length; i++) {
    salas[data[i].nome] = [];
  }
});

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
      const { sender, message, sala } = msgObject;
      console.log(msgObject);

      for (let username in salas[sala]) {
        salas[sala][username].send(
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
        console.log('\x1b[31m Usuário já existe :( \x1b[0m');
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
      console.log(usuario);
      console.log(senha);
      const user = await Usuario.findOne({
        where: {
          usuario: usuario,
          senha: senha,
        },
      });

      console.log('se tiver vivo diga \x1b[32m"oi"\x1b[0m');
      console.log(user);

      if (user) {
        users[usuario] = client;

        client.send(
          JSON.stringify({
            action: 'logar',
            success: true,
            usuario: user.usuario,
            telefone: user.telefone,
            message: 'Login realizado com sucesso',
          }),
        );

        console.log(`Usuário ${usuario} logado`);
        let salastemp = [];
        for (const key in salas) {
          salastemp.push(key);
        }
        client.send(
          JSON.stringify({
            action: 'atualizarsala',
            salas: salastemp,
          }),
        );
      } else {
        client.send(
          JSON.stringify({
            action: 'logar',
            success: false,
            message: 'Usuário ou senha inválidos',
          }),
        );
      }
    } else if (msgObject.action == 'criarsalas') {
      const { nome } = msgObject;

      const sala = await Sala.findOne({
        where: {
          nome: nome,
        },
      });
      if (sala) {
        client.send(
          JSON.stringify({
            action: 'criarsalas',
            success: false,
            message: 'Sala já existe',
          }),
        );
        console.log('\x1b[31m A Sala já existe :( \x1b[0m');
      } else {
        let sala = await Sala.create({
          nome: nome,
        });
        await sala.save();
        salas[sala.nome] = [];
        let salastemp = [];
        for (const key in salas) {
          salastemp.push(key);
        }
        for (const username in users) {
          users[username].send(
            JSON.stringify({
              action: 'atualizarsala',
              salas: salastemp,
            }),
          );
        }
      }
    } else if (msgObject.action == 'atualizaruser') {
      const { sala } = msgObject;
      let listuser = [];

      for (let username in salas[sala]) {
        listuser.push(username);
      }
      for (let username in salas[sala]) {
        salas[sala][username].send(
          JSON.stringify({
            action: 'atualizaruser',
            users: listuser,
          }),
        );
      }
    } else if (msgObject.action == 'entrarSala') {
      const { sala, user } = msgObject;
      salas[sala][user] = client;
      let listuser = [];

      for (let username in salas[sala]) {
        listuser.push(username);
      }
      for (let username in salas[sala]) {
        salas[sala][username].send(
          JSON.stringify({
            action: 'atualizaruser',
            users: listuser,
          }),
        );
      }
    }
  });
});
