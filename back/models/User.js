const mongoose = require('mongoose');
//permet de vérifier que le mail enregistré sera unique(package installé <mongoose-unique-validator>)
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

//applique uniqueValidator au schéma utilisateur
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);