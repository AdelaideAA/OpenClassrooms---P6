require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');



const sauceRoutes = require ('./routes/sauce');
const userRoutes = require ('./routes/user')

// console.log(process.env);
// console.log("Mot de passe Mongo :", process.env.MDBUSER);
// const password = process.env.MDBUSER;
// console.log(password);
const password = "JK5wt6uAMS1UpqFZ";

mongoose.connect(`mongodb+srv://AA:${password}@cluster0.m1zunf1.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//permet d'indiquer le début de l'adresse de chaque point d'accès de '....Routes'
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//indique comment traiter la requête vers la route /image
app.use('/images', express.static(path.join(__dirname, 'images')))
  

module.exports = app;