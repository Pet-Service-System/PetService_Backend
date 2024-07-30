const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentDetailsSchema = new Schema({
  PaymentDetailsID: { type: String, required: true, unique: true },
  BookingID: { type: String, required: true, ref: 'CoreBooking' },
  PaypalOrderID: { type: String, required: true },
  ExtraCharge: { type: Number },
  TotalPrice: { type: Number }
}, { versionKey: false });

const PaymentDetails = mongoose.model('PaymentDetails', paymentDetailsSchema, 'PaymentDetails');
module.exports = PaymentDetails;
