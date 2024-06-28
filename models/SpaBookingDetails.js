const mongoose = require('mongoose');
const { Schema } = mongoose;

const spaBookingDetailsSchema = new Schema({
 BookingDetailsID: { type: String, required: true, unique: true },
 BookingID: { type: String, required: true, ref: 'SpaBooking' },
 CustomerName:  { type: String, required: true },
 Phone: { type: Number, required: true },
 PetID: { type: String, required: true, ref: 'Pet' },
  ServiceID: { type: String, required: true, ref: 'SpaService' },
  BookingDate: {type: String, required: true},
  BookingTime: { type: String, required: true },
  Feedback: { type: String },
});



const SpaBooking = mongoose.model('SpaBookingDetails', spaBookingDetailsSchema, 'SpaBookingDetails');
module.exports = SpaBooking;
