'use strict';
const socket = io();
let msgtpl = $('#msgtpl').html();//Template du message
$('#msgtpl').remove();//On a récupérer le template dans la variable let, donc on peux le supprimer

$('#loginForm').submit(function (event) {
  event.preventDefault();//Empêche la soumission du formulaire
  //On envoi l'évènement login à notre serveur avec un objet contenant les valeurs username et mail
  socket.emit('login', {
    username : $('#username').val(),
    mail     : $('#mail').val()
  })
});

//On écoute l'envoi du fait que l'utilisateur est bien connecté
socket.on('logged', function () {
  $('#login').fadeOut();//On cache le formulaire quand un user est connecté
  $('#message').focus();//On place le focus sur le champ message lors d'une connexion
});

/**
 * Envoi de message
 */
$('#form').submit(function (event) {
  event.preventDefault();
  socket.emit('mewmsg', { message : $('#message').val()});//On envoi au serveur la valeur du champs message
  $('#message').val('');//On vide la valeur du message
  $('#message').focus();//On remet le focus sur le champ message
})

//Reception de nouveau message
socket.on('newmessage', function (message) {
  $('#messages').append('<div class="message">' + Mustache.render(msgtpl, message) + '</div>');
  $('#messages').animate( {scrollTop : $('#messages').prop('scrollHeight') }, 500);//Permet de faire un scroll vers le bas après chaque message
});

/**
 * Gestion des connecté
 */
//On écoute l'envoi du serveur d'un nouvel utilisateur
socket.on('newusr', function (user) {
  $('#users').append('<img class="imgAvatar" src="' + user.avatar + '" id="' + user.id + '">'); //l'id est nécessaire pour supprimer l'image lors d'une déconnexion
  $('#users').append('<p class="p grey paraAvatar">' + user.username + '</p>');
});

//On écoute l'envoi du serveur quand un utilisateur se déconnecte
socket.on('disconnectuser', function (user) {
  $('#' + user.id).remove();//On récupère l'id de l'utilisateur qui se déco pour le supprimer
});






