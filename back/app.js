require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//permet d'accéder au path du serveur pour gérer la ressource image
const path = require('path');

const sauceRoutes = require ('./routes/sauce');
const userRoutes = require ('./routes/user')

const password = process.env.MDBUSER;

//connexion à la BDD
mongoose.connect(`mongodb+srv://AA:${password}@cluster0.m1zunf1.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//middleware qui permet d'accéder aux requêtes qui contiennent du json
app.use(express.json());

//permet de gérer CORS (interaction entre serveur et navigateur)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
    next();
});

//permet d'indiquer le début de l'adresse de chaque point d'accès de '....Routes'
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//indique comment traiter la requête vers la route /image
app.use('/images', express.static(path.join(__dirname, 'images')))
  
//permet d'exporter l'application pour pouvoir y accéder depuis les autres fichiers
module.exports = app;