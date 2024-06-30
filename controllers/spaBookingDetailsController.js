const SpaBookingDetails = require('../models/SpaBookingDetails');
const { generateSpaBookingDetailsID } = require('../utils/idGenerators');

// Create a new spa booking detail
exports.createBookingDetail = async (req, res) => {
    try {
        const newId = await generateSpaBookingDetailsID();
        const newBookingDetail = new SpaBookingDetails({ ...req.body, BookingDetailsID: newId });
        await newBookingDetail.save();
        res.status(201).json(newBookingDetail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all spa booking details
exports.getAllBookingDetails = async (req, res) => {
    try {
        const bookingDetails = await SpaBookingDetails.find();
        res.status(200).json(bookingDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single spa booking detail by booking details ID
exports.getBookingDetailById = async (req, res) => {
    try {
        const bookingDetail = await SpaBookingDetails.findOne({ BookingDetailsID: req.params.id });
        if (bookingDetail) {
            res.status(200).json(bookingDetail);
        } else {
            res.status(404).json({ message: 'Booking detail not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single spa booking detail by booking ID
exports.getBookingDetailByBookingId = async (req, res) => {
    try {
        const bookingDetail = await SpaBookingDetails.findOne({ BookingID: req.params.bookingId });
        if (bookingDetail) {
            res.status(200).json(bookingDetail);
        } else {
            res.status(404).json({ message: 'Booking detail not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update a spa booking detail by ID
exports.updateBookingDetailById = async (req, res) => {
    try {
        const updatedBookingDetail = await SpaBookingDetails.findOneAndUpdate({ BookingDetailsID: req.params.id }, req.body, { new: true });
        if (updatedBookingDetail) {
            res.status(200).json(updatedBookingDetail);
        } else {
            res.status(404).json({ message: 'Booking detail not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a spa booking detail by ID
exports.deleteBookingDetailById = async (req, res) => {
    try {
        const deletedBookingDetail = await SpaBookingDetails.findOneAndDelete({ BookingDetailsID: req.params.id });
        if (deletedBookingDetail) {
            res.status(200).json({ message: 'Booking detail deleted' });
        } else {
            res.status(404).json({ message: 'Booking detail not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};