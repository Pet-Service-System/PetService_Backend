
const SpaBooking = require('../models/SpaBooking');
const SpaBookingDetails = require('../models/SpaBookingDetails');
const { generateSpaBookingID } = require('../utils/idGenerators');

// Create a new spa booking
exports.createSpaBooking = async (req, res) => {
  try {
    const newId = await generateSpaBookingID(); // Generate a new unique BookingDetailID
    const spaBooking = new SpaBooking({
      ...req.body,
      BookingID: newId,
      CurrentStatus: req.body.Status,
      StatusChanges: [{ Status: req.body.Status, ChangeTime: new Date() }]
    });
    await spaBooking.save();
    res.status(201).json(spaBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if booking can be made
exports.checkBooking = async (req, res) => {
  const { BookingDate, BookingTime, PetID } = req.body;
  console.log(req.body)
  try {
    // Check if there is an existing booking with the same date, time, and pet ID
    const existingBookingDetail = await SpaBookingDetails.findOne({
      BookingDate,
      BookingTime,
      PetID
    });
    if (existingBookingDetail) {
      // If found, get the BookingID and check the status in the SpaBooking collection
      const { BookingID } = existingBookingDetail;
      const existingBooking = await SpaBooking.findOne({ BookingID });
      console.log(existingBooking)
      // If the status is 'Cancelled', the slot can be booked
      if (existingBooking && existingBooking.CurrentStatus != 'Canceled') {
        return res.status(409).json({
          canBook: false,
          message: 'Booking conflict: The selected pet is already booked at this time and date. Please choose a different time slot.',
        });
      }
    }

    // Count existing orders for the given date and time
    const existingOrdersCount = await SpaBookingDetails.countDocuments({
      BookingDate,
      BookingTime,
      status: { $ne: 'Cancelled' }
    });

    const maxOrdersPerSlot = 4;
    if (existingOrdersCount >= maxOrdersPerSlot) {
      return res.status(400).json({
        canBook: false,
        message: 'Maximum number of orders per slot reached',
      });
    }

    // If both checks pass
    res.status(200).json({ canBook: true });
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
    const { Status, StatusChanges, ...updateData } = req.body;

    const updateOptions = {
      $set: { ...updateData }, 
    };

    if (Status) {
      updateOptions.$set.CurrentStatus = Status; 
      updateOptions.$push = {
        StatusChanges: { Status, ChangeTime: new Date() }, 
      };
    }

    const spaBooking = await SpaBooking.findOneAndUpdate(
      { BookingID: req.params.id },
      updateOptions,
      { new: true, runValidators: true } 
    );

    if (!spaBooking) {
      return res.status(404).json({ error: 'Spa Booking not found' });
    }

    res.status(200).json(spaBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



