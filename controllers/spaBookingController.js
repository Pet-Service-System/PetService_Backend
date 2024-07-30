
const SpaBooking = require('../models/SpaBooking');
const SpaBookingDetails = require('../models/SpaBookingDetails');
const PaymentDetails = require('../models/PaymentDetails');
const AdditionalInfo = require('../models/AdditionalInfo');
PAYPAL_CLIENT_ID=process.env.PAYPAL_CLIENT_ID;
PAYPAL_SECRET=process.env.PAYPAL_SECRET;
const crypto = require('crypto-js');

const { generateSpaBookingID, generateSpaBookingDetailsID, generatePaymentDetailsID, generateAdditionalInfoID } = require('../utils/idGenerators');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    // Generate unique IDs
    const BookingID = await generateSpaBookingID();
    const PaymentDetailsID = await generatePaymentDetailsID();
    const BookingDetailsID = await generateSpaBookingDetailsID();
    const AdditionalInfoID = await generateAdditionalInfoID();

  
    const PaypalOrderID = crypto.AES.encrypt(req.body.PaypalOrderID, process.env.PAYPAL_CLIENT_SECRET).toString();


    const paymentDetails = new PaymentDetails({
      PaymentDetailsID,
      BookingID,
      PaypalOrderID,
      ExtraCharge: bookingData.ExtraCharge,
      TotalPrice: bookingData.TotalPrice
    });

    await paymentDetails.save();

    const spaBookingDetails = new SpaBookingDetails({
      BookingDetailsID,
      BookingID,
      CustomerName: bookingData.CustomerName,
      Phone: bookingData.Phone,
      PetID: bookingData.PetID,
      PetName: bookingData.PetName,
      PetGender: bookingData.PetGender,
      PetStatus: bookingData.PetStatus,
      PetTypeID: bookingData.PetTypeID,
      PetWeight: bookingData.PetWeight,
      ActualWeight: bookingData.ActualWeight,
      PetAge: bookingData.PetAge,
      BookingDate: bookingData.BookingDate,
      BookingTime: bookingData.BookingTime,
      ServiceID: bookingData.ServiceID
    });
    console.log(spaBookingDetails);
    await spaBookingDetails.save();

   
    const spaBooking = new SpaBooking({
      BookingID,
      CurrentStatus: bookingData.CurrentStatus,
      CreateDate: bookingData.CreateDate,
      AccountID: bookingData.AccountID,
      TotalPrice: bookingData.TotalPrice,
      PaymentDetailsID,
      BookingDetailsID,
      StatusChanges: [{ Status: bookingData.CurrentStatus, ChangeTime: new Date() }],
      isSpentUpdated: bookingData.isSpentUpdated,
      VoucherID: bookingData.VoucherID
    });

    await spaBooking.save();

    // Create and save AdditionalInfo
    const additionalInfo = new AdditionalInfo({
      AdditionalInfoID,
      BookingID,
      CancelReason: bookingData.CancelReason,
      CaretakerNote: bookingData.CaretakerNote,
      CaretakerID: bookingData.CaretakerID,
      Feedback: bookingData.Feedback,
      isReplied: bookingData.isReplied
    });

    await additionalInfo.save();

    // Send response
    res.status(201).json(spaBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all spa bookings
exports.getSpaBookings = async (req, res) => {
  try {
    const spaBookings = await SpaBooking.find()
      .populate('AccountID') 
      .populate('PaymentDetailsID')  
      .populate('BookingDetailsID')
      .populate('AdditionalInfoID'); 

    res.status(200).json(spaBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get a booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const bookingID = req.params.id;
    const booking = await SpaBooking.findOne({ BookingID: bookingID })
      .populate('PaymentDetailsID')
      .populate('BookingDetailsID')
      .populate('StatusChanges')
      .populate('AdditionalInfoID');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.PaypalOrderID) {
      const decryptedPaypalOrderID = crypto.AES.decrypt(booking.PaypalOrderID, process.env.PAYPAL_CLIENT_SECRET).toString(crypto.enc.Utf8);
      booking.PaypalOrderID = decryptedPaypalOrderID;
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.checkBooking = async (req, res) => {
  const { BookingDate, BookingTime, PetID } = req.body;
  try {
    // Find all existing booking details with the same date, time, and pet ID
    const existingBookingDetails = await SpaBookingDetails.find({
      BookingDate,
      BookingTime,
      PetID
    });

    if (existingBookingDetails.length > 0) {
      // Extract BookingIDs from the existing details
      const bookingIds = existingBookingDetails.map(detail => detail.BookingID);


      const existingBookings = await SpaBooking.find({
        BookingID: { $in: bookingIds }
      });

      const activeBookings = existingBookings.filter(booking =>
        booking.CurrentStatus !== 'Cancelled'
      );

      if (activeBookings.length > 0) {
        return res.status(409).json({
          canBook: false,
          message: 'Booking conflict: The selected pet is already booked at this time and date. Please choose a different time slot.',
        });
      }
    }
    const existingOrdersCount = await SpaBooking.countDocuments({
      BookingDate,
      BookingTime,
      CurrentStatus: { $ne: 'Cancelled' }
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

exports.getSpaBookingsByAccountID = async (req, res) => {
  try {
    const accountId = req.params.accountId;

    // Find spa bookings by AccountID and populate references if needed
    const spaBookings = await SpaBooking.find({ AccountID: accountId })
      .populate('AccountID') 
      .populate('PaymentDetailsID') 
      .populate('BookingDetailsID')
      .populate('AdditionalInfoID');

    if (spaBookings.length === 0) {
      return res.status(404).json({ error: 'No Spa Bookings found for this AccountID' });
    }

    if (booking.PaypalOrderID) {
      const decryptedPaypalOrderID = crypto.AES.decrypt(booking.PaypalOrderID, process.env.PAYPAL_CLIENT_SECRET).toString(crypto.enc.Utf8);
      booking.PaypalOrderID = decryptedPaypalOrderID;
    }

    res.status(200).json(spaBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const bookingID = req.params.id;
    const bookingData = req.body;

    const SpaBooking = await SpaBooking.findOneAndUpdate(
      { BookingID: bookingID },
      bookingData,
      { new: true }
    );

    if (!SpaBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(SpaBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

