const mongoose = require('mongoose');
const { Schema } = mongoose;

const spaBookingSchema = new Schema({
  BookingID: { type: String, required: true, unique: true },
  Status: { type: String, required: true },
  CreateDate: { type: Date, required: true },
  AccountID: { type: String, required: true, ref: 'Account' },
  isReviewed: {type: Boolean, default: false},
  TotalPrice: {type: Number, required: true},
  PaypalOrderID: { type: String, required: true },
  CancelReason: { type: String, required: false },
  CaretakerNote: { type: String, required: false },
  CaretakerID: { type: String, required: false, ref: 'Account' },
}, { versionKey: false });

const SpaBooking = mongoose.model('SpaBooking', spaBookingSchema, 'SpaBookings');
module.exports = SpaBooking;
