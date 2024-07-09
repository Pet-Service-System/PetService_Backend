const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    bankCode: { type: String },
    orderInfo: { type: String, required: true },
    orderType: { type: String, required: true },
    locale: { type: String, default: 'vn' },
    createDate: { type: Date, default: Date.now },
    transactionStatus: { type: String },
    responseCode: { type: String }
});

module.exports = mongoose.model('Payment', PaymentSchema);
