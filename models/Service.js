const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    ServiceID: { type: String, required: true, unique: true },
    ServiceName: { type: String, required: true },
    Description: { type: String },
    ImageURL: { type: String },
    Price: { type: Number, required: true },
    Status: { type: String }
});

const Service = mongoose.model('Service', serviceSchema, 'Services');

module.exports = Service;