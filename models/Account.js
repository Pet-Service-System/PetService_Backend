const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  AccountID: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: Number, required: true },
  role: { type: String, required: true }
}, { versionKey: false });

// Specify the collection name as the third argument to mongoose.model
const Account = mongoose.model('Account', accountSchema, 'Accounts'); 

module.exports = Account;
