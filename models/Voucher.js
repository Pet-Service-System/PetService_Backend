const mongoose = require('mongoose');
const { Schema } = mongoose;

const voucherSchema = new mongoose.Schema({
    VoucherID: { type: String, required: true, unique: true },
    Pattern: { type: String, required: true},
    UsageLimit: {type : Number, required: true},
    DiscountValue: { type: Number, required: true},
    MinimumOrderValue: {type: Number, required: false},
    UsingType: { type: String, required: false},
    Status: { type: String, required: true},
    ExpirationDate: { type: Date, required: true}
  }, { versionKey: false },
  );

  const Voucher = mongoose.model('Voucher', voucherSchema, 'Vouchers');

module.exports = Voucher;