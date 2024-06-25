const mongoose = require('mongoose');

const petTypeSchema = new mongoose.Schema({
    PetTypeID: { type: String, required: true },
    TypeName: { type: String, required: true },
    Description: { type: String, required: true }
});

const PetType = mongoose.model('PetType', petTypeSchema,'PetTypes');

module.exports = PetType;
