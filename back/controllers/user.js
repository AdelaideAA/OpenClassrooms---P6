//installation du package bcrypt
const bcrypt = require("bcrypt");

//installation du package jsonwebtoken
const jwt = require("jsonwebtoken");

//Permet de récuperer le schéma dans les models
const User = require("../models/User");

//récupération du plugin password-validator qui permettra de renforcer le choix du mot de passe
const passwordValidator = require("password-validator");

// récupération du plugin rate-limit qui permet de limiter le nombre d'essai de connexion
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Vous avez atteint le maximum d'essais de connexion. Votre compte est bloqué 15mn."
})



// Creation du schema pour renforcer le password
const passwordSchema = new passwordValidator();
passwordSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase(1) // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(1) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist these values


//permet de créer un user + utiliser le shéma de password et de crypter le mot de passe lors d'une inscription
exports.signup = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    // si le mot de passe n'est pas valide
    return res
      .status(400)
      .json({
        message:
          'Le mot de passe doit contenir au min 8 caractères, 1 majuscule et 1 chiffre',
      });
  } else if (passwordSchema.validate(req.body.password)) {
    // si le mot de passe est ok
    bcrypt
      .hash(req.body.password, 10) //on appel bcrypt auquel on passe le mot de passe et on sel 10fois avec l'algo de hachage
      .then((hash) => {
        const user = new User({
          //crée un nouvel user avec le model existant
          email: req.body.email,
          password: hash, //enregistre le mot de passe haché
        });
        user
          .save() //enregistre dans la base de données le nouvel utilisateur
          .then(() => res.status(201).json({ message: "Utilisateur créé !" })) //201 création de ressource
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error })); //500 erreur serveur
  }
};
//permet à l'utilisateur de se connecter et  de vérifier le nombre de test de connexion
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        //vérifie si l'utilisateur existe
        res
          .status(401)
          .json({ message: "identifiant/mot de passe incorrecte" });
      } else {
        //verifie si le mot de passe correspond avec le hash de la BDD
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "identifiant/mot de passe incorrecte" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  //permet d'encoder les informations
                  { userId: user._id },
                  "RANDOM_TOKEN_SECRET", //clé secrète
                  { expiresIn: "24h" } //au dela de 24h le token ne sera plus valide
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
