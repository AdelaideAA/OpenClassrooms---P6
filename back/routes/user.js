//Permet d'utiliser express
const express = require('express');
const router = express.Router();

//associe controllers et routes
const userControllers = require('../controllers/user');
const password = require('../controllers/user');

//créer les chemins avec les bons verbes
router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);

module.exports = router; 