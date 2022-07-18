//Permet d'utiliser express
const express = require('express');
const router = express.Router();

//associe controllers et routes
const userControllers = require('../controllers/user');
// récupère la fonction pour limiter les essais de mot de passe
const limiter = require('../middleware/limiter')

//créer les routes pour se créer/connecter un compte
router.post('/signup', userControllers.signup);
router.post('/login', limiter, userControllers.login);

module.exports = router; 

