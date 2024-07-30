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
  TotalPrice: { type: Number, required: true },
  PaymentDetailsID: { type: String, ref: 'PaymentDetails' },
  BookingDetailsID: { type: String, ref: 'BookingDetails' },
  AdditionalInfoID: { type: String, ref: 'AdditionalInfo' },
  PaymentDetailsID: { type: String, ref: 'PaymentDetails' },
  StatusChanges: [statusChangeSchema],
  isSpentUpdated: { type: Boolean, default: false },
  VoucherID: { type: String },
}, { versionKey: false, timestamps: true });

const SpaBooking = mongoose.model('SpaBooking', spaBookingSchema, 'SpaBookings');
module.exports = SpaBooking;