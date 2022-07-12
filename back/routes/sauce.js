const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');//permettra de vérifier l'authentification avant d'effectuer une action
const multer = require('../middleware/multer-config');

const sauceControllers = require('../controllers/sauce')

//permet de créer et enregister une sauce
router.post('/', auth, multer, sauceControllers.createSauce);

//Permet de modifier la sauce
router.put('/:id', auth, multer, sauceControllers.modifySauce);

//Permet de supprimer la sauce
router.delete('/:id', auth, sauceControllers.deleteSauce);

//Récupère la sauce par son id
router.get('/:id', auth, sauceControllers.getOneSauce);

//récupère la totalité des sauces
router.get('/', auth, sauceControllers.getAllSauces);

//permet de liker ou disliker une sauce
router.post('/:id/like', auth, sauceControllers.likeSauce);

module.exports = router;