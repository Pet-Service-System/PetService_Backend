const mongoose = require('mongoose');
const { Schema } = mongoose;

const voucherSchema = new mongoose.Schema({
    VoucherID: { type: String, required: true, unique: true },
    Pattern: { type: String, required: true},
    Description: { type: String, required: true},
    Amount: {type : Number, required: true},
    Value: { type: Number, required: true},
    AccountID: {type: String, default: null, ref: "Account" },
    Status: { type: String, required: true},
    ExpirationDate: { type: Date, required: true}
  }, { versionKey: false },
  );

  const Voucher = mongoose.model('Voucher', voucherSchema, 'Vouchers');

module.exports = Voucher;