const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    PetID: { type: String, required: true, unique: true },
    PetName: { type: String, required: true },
    Gender: { type: String, required: true },
    Status: { type: String, required: true },
    AccountID: { type: String, required: true },
    PetTypeID: { type: mongoose.Schema.Types.String, ref: 'PetType', required: true },
    Weight: { type: Number, required: true },
    Age: { type: Number, required: true }
} , { versionKey: false });

const Pet = mongoose.model('Pet', petSchema, 'Pets');

module.exports = Pet;
