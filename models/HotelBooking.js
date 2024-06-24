const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingDetailSchema = new Schema({
  HotelDetailID: { type: String, required: true, unique: true },
  CheckInDate: { type: Date, required: true },
  CheckOutDate: { type: Date, required: true },
  TotalPrice: { type: Number, required: true },
  HotelID: { type: String, required: true, ref: 'HotelService' }
});

const hotelBookingSchema = new Schema({
  BookingDetailID: { type: String, required: true, unique: true },
  Status: { type: String, required: true },
  CreateDate: { type: Date, required: true },
  AccountID: { type: String, required: true, ref: 'Account' },
  Name:  { type: String, required: true },
  Phone: { type: Number, required: true },
  PetID: { type: String, required: true },
  Feedback: { type: String },
  BookingDetails: [bookingDetailSchema],
});

const BookingHotel = mongoose.model('HotelBooking', hotelBookingSchema, 'HotelBookings');
module.exports = BookingHotel;
