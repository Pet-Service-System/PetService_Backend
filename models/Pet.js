const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    PetID: { type: String, required: true, unique: true },
    PetName: { type: String, required: true },
    Gender: { type: String, required: true },
    Status: { type: String, required: true },
    AccountID: { type: String, required: true },
    PetTypeID: { type: mongoose.Schema.Types.String, ref: 'PetType', required: true }
});

module.exports = mongoose.model('Pet', petSchema);