const mongoose = require('mongoose');
const { Schema } = mongoose;

const additionalInfoSchema = new Schema({
  BookingID: { type: Schema.Types.ObjectId, required: true, ref: 'SpaBooking' },
  CancelReason: { type: String },
  CaretakerNote: { type: String },
  CaretakerID: { type: String, ref: 'Account' },
  Feedback: { type: String },
  isReplied: { type: Boolean },
}, { versionKey: false });

const AdditionalInfo = mongoose.model('AdditionalInfo', additionalInfoSchema, 'AdditionalInfos');
module.exports = AdditionalInfo;
