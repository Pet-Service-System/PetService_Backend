const HotelService = require('../models/HotelService'); 

// Create a new hotel
exports.createHotel = async (req, res) => {
    const hotel = new HotelService(req.body);
    try {
        await HotelService.save();
        res.status(201).send(hotel);
    } catch (e) {
        res.status(400).send(e);
    }
};

// Get a list of hotels
exports.getHotels = async (req, res) => {
    try {
        const hotels = await HotelService.find({});
        res.send(hotels);
    } catch (e) {
        res.status(500).send(e);
    }
};

// Get a hotel by ID
exports.getHotelById = async (req, res) => {
    const _id = req.params.id;
    try {
        const hotel = await HotelService.findById(_id);
        if (!hotel) {
            return res.status(404).send();
        }
        res.send(hotel);
    } catch (e) {
        res.status(500).send(e);
    }
};

// Update a hotel by ID
exports.updateHotel = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['HotelName', 'Description', 'Price'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const hotel = await HotelService.findById(req.params.id);
        if (!hotel) {
            return res.status(404).send();
        }

        updates.forEach((update) => hotel[update] = req.body[update]);
        await hotel.save();
        res.send(hotel);
    } catch (e) {
        res.status(400).send(e);
    }
};

// Delete a hotel by ID
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await HotelService.findByIdAndDelete(req.params.id);
        if (!hotel) {
            return res.status(404).send();
        }
        res.send(hotel);
    } catch (e) {
        res.status(500).send(e);
    }
};
