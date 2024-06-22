const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    ServiceID: { type: String, required: true, unique: true },
    ServiceName: { type: String, required: true },
    Description: { type: String },
    ImageURL: { type: String },
    PetTypeID : { type: String, required: true, ref: 'PetType' },
    Price: { type: Number, required: true },
    Status: { type: String }
});

const SpaService = mongoose.model('SpaService', serviceSchema, 'SpaServices');

module.exports = SpaService;