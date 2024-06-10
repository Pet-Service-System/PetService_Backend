const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    ServiceID: { type: String, required: true, unique: true },
    ServiceName: { type: String, required: true },
    Description: { type: String },
    Image: { type: String },
    Price: { type: Number, required: true },
    Status: { type: String }
});

module.exports = mongoose.model('Service', serviceSchema, 'Services');
