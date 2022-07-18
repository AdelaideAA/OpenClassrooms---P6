// récupération du plugin rate-limit qui permet de limiter le nombre d'essai de connexion
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Vous avez atteint le maximum d'essais de connexion. Votre compte est bloqué 15mn."
});

module.exports = limiter;