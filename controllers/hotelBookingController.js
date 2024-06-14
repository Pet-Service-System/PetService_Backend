const BookingHotel = require('../models/bookingHotel');

// Helper function to generate BookingDetailID
const generateBookingDetailID = async () => {
  const lastBooking = await BookingHotel.findOne().sort({ BookingDetailID: -1 }).exec();
  if (lastBooking) {
    const lastIdNum = parseInt(lastBooking.BookingDetailID.substring(2), 10);
    const newIdNum = lastIdNum + 1;
    return `HB${newIdNum.toString().padStart(3, '0')}`;
  }
  return 'HB001';
};

//create a new hotel booking api
exports.createBooking = async (req, res) => {
  try {
    const BookingId = await generateBookingDetailID();
    const newBooking = new BookingHotel({
      BookingDetailID: BookingId,
      Status: req.body.Status,
      Duration: new Date(req.body.Duration),
      Feedback: req.body.Feedback,
      CreateDate: new Date(),
      AccountID: req.body.AccountID,
      PetID: req.body.PetID,
      BookingDetails: req.body.BookingDetails
    });

    const result = await newBooking.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all bookings api
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingHotel.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get a booking by id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await BookingHotel.findOne({ BookingDetailID: req.params.id });
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update a booking
exports.updateBooking = async (req, res) => {
  try {
    const result = await BookingHotel.updateOne(
      { BookingDetailID: req.params.id },
      { $set: req.body }
    );
    if (result.nModified > 0) {
      res.json({ message: 'Booking updated' });
    } else {
      res.status(404).json({ error: 'Booking not found or no changes made' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const result = await BookingHotel.deleteOne({ BookingDetailID: req.params.id });
    if (result.deletedCount > 0) {
      res.json({ message: 'Booking deleted' });
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
