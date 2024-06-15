const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    HotelID: { type: Number, required: true },
    HotelName: { type: String, required: true },
    Description: { type: String, required: true },
    Price: {
        PetWeight: { type: Number, required: true },
        price: { type: Number, required: true }
    }
});

const HotelService = mongoose.model('HotelService', hotelSchema, 'HotelSevices');

module.exports = HotelService;
