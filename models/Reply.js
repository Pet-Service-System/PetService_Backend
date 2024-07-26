const mongoose = require('mongoose');
const { Schema } = mongoose;

const replySchema = new Schema({
    ReplyID: { type: String, required: true, unique: true },
    BookingID: { type: String, required: true, ref: 'SpaBooking' },
    AccountID: { type: String, required: true, ref: 'Account' },
    ReplyDate: { type: Date, required: true},
    ReplyContent: { type: String, required: true },
});

const Reply = mongoose.model('Reply', replySchema, 'Replies');
module.exports = Reply;
