'use strict';

const socketio = require('socket.io'); //socket.io se greffe a http donc au server 
const md5 = require('MD5'); //Nécessaire pour utiliser Gravatar 

let users = {}; //Création d'un objet pour stocker tous les utilisateur qui se connecte
let messages = []; //Création d'un tableau pour stocker tous les messages
let history = 10; //Variable permettant de supprimer les messages plus anciens

module.exports.listen = (server, ServerEvent) => {
  const io = socketio(server);

  io.on('connection', client => {

    let me = false; //Pour stocker l'utilisateur
    console.log('Nouvel utilisateur connecté !', client.id);

    for (const key in users) {
      //On envoi à tous les utilisateur le fait qu'un utilisateur se connecte pour qu'un nouvel utilisateur vois les anciens utilisateurs
      client.emit('newusr', users[key]);
    };

    for (const key in messages) {
      //On envoi à tous les nouveaux utilisateur les anciens message du tchat
      client.emit('newmessage', messages[key]);
    };

    /**
     * Je me connecte
     */
    //On récupère les info envoyer du client avec le socket.emit('login')
    client.on('login', function (user) {
      me = user; //on stocke l'utilisateur dans la variable me
      me.id = user.mail.replace('@', '-').replace('.', '-'); //on remplace les caractères spéciaux du mail pour avoir un id unique pour chaque user
      me.avatar = 'https://gravatar.com/avatar/' + md5(user.mail) + '?s=50'; //On utilise gravatar pour avoir un avatar, en faisant un md5 du mail
      client.emit('logged'); //on envoi au client le fait que l'on est bien connecté
      users[me.id] = me; //on stocke l'utilisateur dans l'objet users
      io.emit('newusr', me); //on envoi un new user au client avec comme paramètre l'utilisateur me. En faisant io.emit, on envoi cette requête a tout les utilisateurs, toutes les fenêtre recevrons donc la fonction émise dans client.js
    });

    /**
     * On a reçu un message
     */
    client.on('mewmsg', function (message) {
      message.user = me; //On associe le message à l'utilisateur
      let date = new Date();
      message.h = date.getHours(); //on récupère l'heure du message
      message.m = date.getMinutes(); //on récupère les minutes du message
      messages.push(message); //On stocke le message dans le tableau messages
      if (messages.length > history) {
        messages.shift(); //shift supprime le premier element d'un tableau donc le message le plus ancien
      }
      io.emit('newmessage', message); //On envoi le message à tous les utilisateurs
    });


    /**
     * Je quitte le Tchat
     */
    client.on('disconnect', function () {
      //dans le cas ou l'utilisateur se déconnecte sans s'être connecté
      if (!me) {
        return false;
      }
      delete users[me.id]; //On supprime l'utilisateur de la liste de tous les utilisateurs lors de la déconnexion 
      io.emit('disconnectuser', me); //On envoi à tous les utilisateurs le fait qu'un user s'est déconnecté
    })

  })
};