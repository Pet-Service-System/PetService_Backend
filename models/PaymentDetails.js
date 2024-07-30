const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentDetailsSchema = new Schema({
  BookingID: { type: Schema.Types.ObjectId, required: true, ref: 'SpaBooking' },
  PaypalOrderID: { type: String, required: true },
  ExtraCharge: { type: Number },
  TotalPrice: { type: Number }
}, { versionKey: false });


const PaymentDetails = mongoose.model('PaymentDetails', paymentDetailsSchema, 'PaymentDetails');
module.exports = PaymentDetails;
