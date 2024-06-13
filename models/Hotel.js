const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    HotelID: { type: Number, required: true },
    HotelName: { type: String, required: true },
    HotelType: { type: String, required: true },
    Price: {
        PetWeight: { type: Number, required: true },
        price: { type: Number, required: true }
    }
});

const Hotel = mongoose.model('Hotel', hotelSchema, 'Hotels');

module.exports = Hotel;
