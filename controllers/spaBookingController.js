const SpaBooking = require('../models/SpaBooking');

// create a new spa booking
exports.createSpaBooking = async (req, res) => {
  try {
    const lastBooking = await SpaBooking.findOne().sort({ BookingDetailID: -1 });
    const newId = lastBooking ? `SB${String(parseInt(lastBooking.BookingDetailID.substring(2)) + 1).padStart(3, '0')}` : 'SB001';

    const totalPrice = req.body.BookingDetails.reduce((acc, detail) => acc + detail.Price, 0);

    const spaBooking = new SpaBooking({ ...req.body, BookingDetailID: newId, TotalPrice: totalPrice });
    await spaBooking.save();
    res.status(201).json(spaBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all spa bookings
exports.getSpaBookings = async (req, res) => {
  try {
    const spaBookings = await SpaBooking.find();
    res.status(200).json(spaBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get spa booking by id
exports.getSpaBookingById = async (req, res) => {
  try {
    const spaBooking = await SpaBooking.findById(req.params.id);
    if (!spaBooking) {
      return res.status(404).json({ error: 'Spa Booking not found' });
    }
    res.status(200).json(spaBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get spa bookings by account id
exports.getSpaBookingsByAccountID = async (req, res) => {
  try {
    const spaBookings = await SpaBooking.find({ AccountID: req.params.accountId });
    if (spaBookings.length === 0) {
      return res.status(404).json({ error: 'No Spa Bookings found for this AccountID' });
    }
    res.status(200).json(spaBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update spa booking
exports.updateSpaBooking = async (req, res) => {
  try {
    const totalPrice = req.body.BookingDetails.reduce((acc, detail) => acc + detail.Price, 0);
    const spaBooking = await SpaBooking.findByIdAndUpdate(req.params.id, { ...req.body, TotalPrice: totalPrice }, { new: true });
    if (!spaBooking) {
      return res.status(404).json({ error: 'Spa Booking not found' });
    }
    res.status(200).json(spaBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete spa booking
exports.deleteSpaBooking = async (req, res) => {
  try {
    const spaBooking = await SpaBooking.findByIdAndDelete(req.params.id);
    if (!spaBooking) {
      return res.status(404).json({ error: 'Spa Booking not found' });
    }
    res.status(200).json({ message: 'Spa Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
