const mongoose = require('mongoose');
const { Schema } = mongoose;

const spaBookingDetailsSchema = new Schema({
 BookingDetailsID: { type: String, required: true, unique: true },
 BookingID: { type: String, required: true, ref: 'SpaBooking' },
  ServiceID: { type: String, required: true, ref: 'SpaService' },
  ServiceName: { type: String, required: true },
  Price: { type: Number, required: true },
  BookingDate: {type: String, required: true},
  BookingTime: { type: String, required: true },
  TotalPrice: { type: Number, required: true },
  Feedback: { type: String },
});



const SpaBooking = mongoose.model('SpaBookingDetails', spaBookingDetailsSchema, 'SpaBookingDetails');
module.exports = SpaBooking;
