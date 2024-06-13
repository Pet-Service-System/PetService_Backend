const Hotel = require('../models/Hotel');

// Tạo một khách sạn mới
exports.createHotel = async (req, res) => {
    const hotel = new Hotel(req.body);
    try {
        await hotel.save();
        res.status(201).send(hotel);
    } catch (e) {
        res.status(400).send(e);
    }
};

// Lấy danh sách các khách sạn
exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({});
        res.send(hotels);
    } catch (e) {
        res.status(500).send(e);
    }
};

// Lấy một khách sạn theo ID
exports.getHotelById = async (req, res) => {
    const _id = req.params.id;
    try {
        const hotel = await Hotel.findById(_id);
        if (!hotel) {
            return res.status(404).send();
        }
        res.send(hotel);
    } catch (e) {
        res.status(500).send(e);
    }
};

// Cập nhật một khách sạn theo ID
exports.updateHotel = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['HotelName', 'HotelType', 'Price'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const hotel = await Hotel.findById(req.params.id);
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

// Xóa một khách sạn theo ID
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) {
            return res.status(404).send();
        }
        res.send(hotel);
    } catch (e) {
        res.status(500).send(e);
    }
};
