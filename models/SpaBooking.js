const mongoose = require('mongoose');
const { Schema } = mongoose;

const statusChangeSchema = new Schema({
  Status: { type: String, required: true },
  ChangeTime: { type: Date, required: true, default: Date.now }
}, { _id: false });


const spaBookingSchema = new Schema({
  BookingID: { type: String, required: true, unique: true },
  CurrentStatus: { type: String, required: true },
  CreateDate: { type: Date, required: true },
  AccountID: { type: String, required: true, ref: 'Account' },
  isReviewed: {type: Boolean, default: false},
  TotalPrice: {type: Number, required: true},
  PaypalOrderID: { type: String, required: true },
  CancelReason: { type: String, required: false },
  CaretakerNote: { type: String, required: false },
  CaretakerID: { type: String, required: false, ref: 'Account' },
  Feedback: { type: String, required: false },
  isSpentUpdated: { type: Boolean, default: false },
  StatusChanges: [statusChangeSchema],
  isReplied: { type: Boolean, required: true },
}, { versionKey: false });

const SpaBooking = mongoose.model('SpaBooking', spaBookingSchema, 'SpaBookings');
module.exports = SpaBooking;
