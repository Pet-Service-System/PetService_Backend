
const SpaBooking = require('../models/SpaBooking');
const SpaBookingDetails = require('../models/SpaBookingDetails');
const PaymentDetails = require('../models/PaymentDetails');
const AdditionalInfo = require('../models/AdditionalInfo');
PAYPAL_CLIENT_ID=process.env.PAYPAL_CLIENT_ID;
PAYPAL_SECRET=process.env.PAYPAL_SECRET;
const crypto = require('crypto-js');



// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    let encryptedPaypalOrderID;
    try {
      encryptedPaypalOrderID = crypto.AES.encrypt(bookingData.PaypalOrderID, process.env.PAYPAL_CLIENT_SECRET).toString();
    } catch (err) {
      throw new Error('Failed to encrypt PaypalOrderID');
    }

    const spaBooking = new SpaBooking({
      CurrentStatus: bookingData.CurrentStatus,
      CreateDate: bookingData.CreateDate,
      AccountID: bookingData.AccountID,
      TotalPrice: bookingData.TotalPrice,
      StatusChanges: [{ Status: bookingData.CurrentStatus, ChangeTime: new Date() }],
      isSpentUpdated: bookingData.isSpentUpdated,
      VoucherID: bookingData.VoucherID
    });
    const savedSpaBooking = await spaBooking.save();

    const paymentDetails = new PaymentDetails({
      BookingID: savedSpaBooking._id,
      PaypalOrderID: encryptedPaypalOrderID,
      ExtraCharge: bookingData.ExtraCharge,
      TotalPrice: bookingData.TotalPrice
    });
    await paymentDetails.save();

    const spaBookingDetails = new SpaBookingDetails({
      BookingID: savedSpaBooking._id,
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
    await spaBookingDetails.save();

    const additionalInfo = new AdditionalInfo({
      BookingID: savedSpaBooking._id,
      CancelReason: bookingData.CancelReason,
      CaretakerNote: bookingData.CaretakerNote,
      CaretakerID: bookingData.CaretakerID,
      Feedback: bookingData.Feedback,
      isReplied: bookingData.isReplied
    });
    await additionalInfo.save();

    savedSpaBooking.PaymentDetailsID = paymentDetails._id;
    savedSpaBooking.BookingDetailsID = spaBookingDetails._id;
    savedSpaBooking.AdditionalInfoID = additionalInfo._id;
    await savedSpaBooking.save();

    // Send response
    res.status(201).json(savedSpaBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all spa bookings
exports.getSpaBookings = async (req, res) => {
  try {
    const spaBookings = await SpaBooking.find()
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
    const booking = await SpaBooking.findById(bookingID)
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

      // Find all bookings with the extracted BookingIDs
      const existingBookings = await SpaBooking.find({
        _id: { $in: bookingIds },
        CurrentStatus: { $ne: 'Cancelled' } // Filter out cancelled bookings
      });

      console.log(existingBookings);

      // If any active bookings exist
      if (existingBookings.length > 0) {
        return res.status(409).json({
          canBook: false,
          message: 'Booking conflict: The selected pet is already booked at this time and date. Please choose a different time slot.',
        });
      }
    }

    // Check for the maximum number of orders per slot
    const existingOrdersCount = await SpaBookingDetails.countDocuments({
      BookingDate,
      BookingTime,
      CurrentStatus: { $ne: 'Cancelled' }
    });

    console.log(existingOrdersCount)

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
      .populate('PaymentDetailsID')
      .populate('BookingDetailsID')
      .populate('AdditionalInfoID');

    if (spaBookings.length === 0) {
      return res.status(404).json({ error: 'No Spa Bookings found for this AccountID' });
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
    console.log(bookingData)
    const spaBooking = await SpaBooking.findById(bookingID);
    if (!spaBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (bookingData.CurrentStatus || bookingData.isSpentUpdated || bookingData.VoucherID) {
      spaBooking.CurrentStatus = bookingData.CurrentStatus || spaBooking.CurrentStatus;
      spaBooking.isSpentUpdated = bookingData.isSpentUpdated || spaBooking.isSpentUpdated;
      spaBooking.VoucherID = bookingData.VoucherID || spaBooking.VoucherID;
      await spaBooking.save();
    }

    if (bookingData.BookingDate || bookingData.BookingTime || bookingData.CustomerName) {
      const spaBookingDetails = await SpaBookingDetails.findOne({ BookingID: bookingID });
      if (spaBookingDetails) {
        spaBookingDetails.BookingDate = bookingData.BookingDate || spaBookingDetails.BookingDate;
        spaBookingDetails.BookingTime = bookingData.BookingTime || spaBookingDetails.BookingTime;
        spaBookingDetails.CustomerName = bookingData.CustomerName || spaBookingDetails.CustomerName;
        await spaBookingDetails.save();
      }
    }

    if (bookingData.CaretakerNote || bookingData.CaretakerID || bookingData.Feedback) {
      const additionalInfo = await AdditionalInfo.findOne({ BookingID: bookingID });
      if (additionalInfo) {
        additionalInfo.CaretakerNote = bookingData.CaretakerNote || additionalInfo.CaretakerNote;
        additionalInfo.CaretakerID = bookingData.CaretakerID || additionalInfo.CaretakerID;
        additionalInfo.Feedback = bookingData.Feedback || additionalInfo.Feedback;
        await additionalInfo.save();
      }
    }
    if (bookingData.ExtraCharge || bookingData.TotalPrice) {
      const paymentDetails = await PaymentDetails.findOne({ BookingID: bookingID });
      if (paymentDetails) {
        paymentDetails.ExtraCharge = bookingData.ExtraCharge || paymentDetails.ExtraCharge;
        paymentDetails.TotalPrice = bookingData.TotalPrice || paymentDetails.TotalPrice;
        await paymentDetails.save();
      }
    }

    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
