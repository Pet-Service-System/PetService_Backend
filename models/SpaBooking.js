const mongoose = require('mongoose');
const { Schema } = mongoose;

const statusChangeSchema = new Schema({
  Status: { type: String, required: true },
  ChangeTime: { type: Date, required: true, default: Date.now }
}, { _id: false });

const spaBookingSchema = new Schema({
  CurrentStatus: { type: String, required: true },
  CreateDate: { type: Date, required: true },
  AccountID: { type: String, required: true, ref: 'Account' },
  TotalPrice: { type: Number, required: true },
  PaymentDetailsID: { type: Schema.Types.ObjectId, ref: 'PaymentDetails' },
  BookingDetailsID: { type: Schema.Types.ObjectId, ref: 'SpaBookingDetails' },
  AdditionalInfoID: { type: Schema.Types.ObjectId, ref: 'AdditionalInfo' },
  StatusChanges: [statusChangeSchema],
  isSpentUpdated: { type: Boolean, default: false },
  VoucherID: { type: String },
}, { versionKey: false, timestamps: false });

const SpaBooking = mongoose.model('SpaBooking', spaBookingSchema, 'SpaBookings');
module.exports = SpaBooking;