const mongoose = require('mongoose');
const { Schema } = mongoose;

const spaBookingDetailsSchema = new Schema({
  BookingDetailsID: { type: String, required: true, unique: true },
  BookingID: { type: String, required: true, ref: 'SpaBooking' },
  CustomerName:  { type: String, required: true },
  Phone: { type: String, required: true },
  PetID: { type: String, required: true, ref: 'Pet' },
  PetName: { type: String, required: true },
  PetGender: { type: String, required: true },
  PetStatus: { type: String, required: true },
  PetTypeID: { type: String, ref: 'PetType', required: true },
  PetWeight: { type: Number, required: true },
  PetAge: { type: Number, required: true },
  BookingDate: {type: String, required: true},
  BookingTime: { type: String, required: true },
  ServiceID: {type : String, required: true, ref: 'SpaService'},
  Feedback: { type: String, required: false },
});

const SpaBooking = mongoose.model('SpaBookingDetails', spaBookingDetailsSchema, 'SpaBookingDetails');
module.exports = SpaBooking;
