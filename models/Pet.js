const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    PetID: { type: String, required: true, unique: true },
    PetName: { type: String, required: true },
    Gender: { type: String, required: true },
    Image: { type: String },
    PetWeight: { type: Number },
    Status: { type: String }
});

module.exports = mongoose.model('Pet', petSchema);
