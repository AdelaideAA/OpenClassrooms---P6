//Récupère le package multer qui permet de gerer des fichiers entrants
const multer = require('multer');

//
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//objet de configuration (enregistre sur le disque)
const storage = multer.diskStorage({
  destination: (req, file, callback) => {//indique d'enregistrer les images dans le dossier images
    callback(null, 'images');
  },
  filename: (req, file, callback) => {//explique quel nom de fichier utiliser
    const name = file.originalname.split(' ').join('_');//récupère le nom d'origine en remplacent les espaces par des _
    const extension = MIME_TYPES[file.mimetype];//indique quel mime-type utiliser pour l'extesion de fichier
    callback(null, name + Date.now() + '.' + extension);//crée le nom complet en ajoutant une timestamp
  }
});

//exporte l'élément
module.exports = multer({storage: storage}).single('image');