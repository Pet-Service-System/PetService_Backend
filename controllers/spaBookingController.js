const OrderDetails = require('../models/OrderDetails');
const SpaBooking = require('../models/SpaBooking');
const SpaBookingDetails = require('../models/SpaBookingDetails');
const { generateSpaBookingID } = require('../utils/idGenerators');

// Create a new spa booking
exports.createSpaBooking = async (req, res) => {
  const { BookingDate, BookingTime } = req.body;
  try {
    const existingOrdersCount = await SpaBookingDetails.countDocuments({
      BookingDate: BookingDate,
      BookingTime: BookingTime,
      status: { $ne: 'Cancelled' } 
  });
  console.log(existingOrdersCount);
    const maxOrdersPerSlot = 4;
    if (existingOrdersCount <= maxOrdersPerSlot) {
    const newId = await generateSpaBookingID(); // Generate a new unique BookingDetailID
    const spaBooking = new SpaBooking({ ...req.body, BookingID: newId });
    await spaBooking.save();
    res.status(201).json(spaBooking);
} else {
  res.status(400).json({ message: 'Maximum number of orders per slot reached' });
}
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all spa bookings
exports.getSpaBookings = async (req, res) => {
  try {
    // Populate references
    const spaBookings = await SpaBooking.find();
    res.status(200).json(spaBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get spa booking by ID
exports.getSpaBookingById = async (req, res) => {
  try {
    const spaBooking = await SpaBooking.findOne({ BookingID: req.params.id });
    if (!spaBooking) {
      return res.status(404).json({ error: 'Spa Booking not found' });
    }
    res.status(200).json(spaBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get spa bookings by Account ID
exports.getSpaBookingsByAccountID = async (req, res) => {
  try {
    // Populate references
    const spaBookings = await SpaBooking.find({ AccountID: req.params.accountId });
    if (spaBookings.length === 0) {
      return res.status(404).json({ error: 'No Spa Bookings found for this AccountID' });
    }
    res.status(200).json(spaBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update spa booking
exports.updateSpaBooking = async (req, res) => {
  try {
    // Create an object that excludes BookingDetailID
    const { BookingID, ...updateData } = req.body;
    
    // Perform the update without BookingDetailID
    const spaBooking = await SpaBooking.findOneAndUpdate(
      { BookingID: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!spaBooking) {
      return res.status(404).json({ error: 'Spa Booking not found' });
    }

    res.status(200).json(spaBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete spa booking
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