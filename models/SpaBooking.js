const mongoose = require('mongoose');
const { Schema } = mongoose;

const spaBookingSchema = new Schema({
  BookingID: { type: String, required: true, unique: true },
  Status: { type: String, required: true },
  CreateDate: { type: Date, required: true },
  TotalPrice: {type: Number, required: true},
  AccountID: { type: String, required: true, ref: 'Account' },
});

const SpaBooking = mongoose.model('SpaBooking', spaBookingSchema, 'SpaBookings');
module.exports = SpaBooking;
