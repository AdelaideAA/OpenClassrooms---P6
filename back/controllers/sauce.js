//Permet de récupérer le schéma crée dans les models
const Sauce = require('../models/Sauce');

//Permet l'utilisation du pluggin fs (gestion de fichier)
const fs = require('fs');

//************logique métier de chaque action

//création de sauce
exports.createSauce = (req, res, next) =>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;//l'id de la sauce sera généré par la base de données

    const sauce = new Sauce({
       ...sauceObject,//opérateur spread est utilisé pour faire une copie de tous les éléments de res.body
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//permet de créer l'url complète
     });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));  
};

//modification de sauce
exports.modifySauce = (req, res, next) => {
    //vérifie s'il y un champs file
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non-autorisé'});
        } else {
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error})
    });
    
};

//Supprime une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then( sauce => {
        if (sauce.userId != req.auth.userId){
            res.status(401).json({ message : 'Non-autorisé'});  
        } else {
            const filename = sauce.imageUrl.split('images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(401).json({ error })); 
            })
        }
    })
    .catch(error => res.status(500).json({ error }))    
}

//accès à une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
}
//accès à l'ensemble des sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}
//Pouvoir liker une sauce
exports.likeSauce = (req, res, next) =>{
    //console.log("like", req.body);
 Sauce.findOne({ _id: req.params.id})
 
 .then((sauce) => {
    //ajoute un like
    if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1){//controle si l'utilisateur à déjà liké
        
        Sauce.updateOne({ _id: req.params.id},
            {
                $inc: {likes: 1},//$inc méthode qui permet d'incrémenter
                $push: {usersLiked: req.body.userId}//et on push dans le tableau usersLiked
            })
        .then(() => res.status(200).json({ message : 'Vous aimez cette sauce !'}))
        .catch(error => res.status(400).json({ error }));
    } 
    //Supprime le like
    if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0){
            
        Sauce.updateOne({ _id: req.params.id},
            {
                $inc: {likes: -1},//$inc méthode qui permet de décrémenter les likes
                $pull: {usersLiked: req.body.userId}//méthode pull permet de supprimer le userId du tableau
            })
        .then(() => res.status(200).json({ message : "Vous n'aimez plus cette sauce !"}))
        .catch(error => res.status(400).json({ error }));
    }
    //ajoute un dislike
    if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){//controle que l'utilisateur n'est pas déjà voté
            
        Sauce.updateOne({ _id: req.params.id},
            {
                $inc: {dislikes: 1},//$inc méthode qui permet d'incrémenter les dislikes
                $push: {usersDisliked: req.body.userId}//On push le userId vers le tableau usersDisliked
            })
        .then(() => res.status(200).json({ message : "Vous n'aimez pas cette sauce !"}))
        .catch(error => res.status(400).json({ error }));
    }
    //Supprime le dislike
    if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){//controle que l'utilisateur n'est pas déjà voté
            
        Sauce.updateOne({ _id: req.params.id},
            {
                $inc: {dislikes: -1},//$inc méthode qui permet de décrémenter les dislikes
                $pull: {usersDisliked: req.body.userId}//On supprime le userId du tableau usersDisliked
            })
        .then(() => res.status(200).json({ message : "Vous ne dislikez plus cette sauce !"}))
        .catch(error => res.status(400).json({ error }));
    }
  
 })
 
 .catch(error => res.status(400).json({ error }));
}