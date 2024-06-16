const mongoose = require('mongoose');
const { Schema } = mongoose;

const spaDetailSchema = new Schema({
  ServiceID: { type: String, required: true, ref: 'SpaService' },
  ServiceName: { type: String, required: true },
  Price: { type: Number, required: true },
});

const spaBookingSchema = new Schema({
  BookingDetailID: { type: String, required: true, unique: true },
  Status: { type: String, required: true },
  Duration: { type: Date, required: true },
  CreateDate: { type: Date, required: true },
  AccountID: { type: String, required: true, ref: 'Account' },
  PetID: { type: String, required: true, ref: 'Pet' },
  BookingDetails: [spaDetailSchema],
  TotalPrice: { type: Number, required: true },
});

const SpaBooking = mongoose.model('SpaBooking', spaBookingSchema, 'SpaBookings');
module.exports = SpaBooking;
