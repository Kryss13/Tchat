//Pour se connecter faire :
//Ouvrir nouveau terminal
//'node server.js' dans le dossier ou se trouve le fichier serveur (cd ../chemin)
//sur le navigateur faire 'localhost:3001'
'use strict'; 
const path = require('path');
const express = require('express');//On récupère express
const app = express();//On instancie express
const http = require('http').createServer(app);// Création du server http en récupérant le server express


app.use(express.static(path.join(__dirname, 'Client'))); //Permet de joindre des éléments de texte permet d'adapter le path à tous les os
//Dirname va chercher le dossier de la racine absolue jusqu'au fichier

// Évènement serveur
const ServerEvent = require(path.join(__dirname, 'Controller', 'ServerEvent'));

require('./Controller/socket.js').listen(http, ServerEvent);
                                                        
http.listen(3001); //Écoute du port 3001
