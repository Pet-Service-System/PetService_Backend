const mongoose = require('mongoose');
const { Schema } = mongoose;

const spaBookingDetailsSchema = new Schema({
 BookingDetailsID: { type: String, required: true, unique: true },
 BookingID: { type: String, required: true, ref: 'SpaBooking' },
 CustomerName:  { type: String, required: true },
 Phone: { type: Number, required: true },
 PetID: { type: String, required: true, ref: 'Pet' },
 PetName: { type: String, required: true },
 Gender: { type: String, required: true },
 Weight: { type: Number, required: true },
 Age: { type: Number, required: true },
  ServiceID: { type: String, required: true, ref: 'SpaService' },
  BookingDate: {type: String, required: true},
  BookingTime: { type: String, required: true },
  Feedback: { type: String },
});



const SpaBooking = mongoose.model('SpaBookingDetails', spaBookingDetailsSchema, 'SpaBookingDetails');
module.exports = SpaBooking;
