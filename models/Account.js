const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  AccountID: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  password: { type: String, required: false },
  address: { type: String, required: false },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  status: { type: Number, required: true },
  role: { type: String, required: true,  default: 'Customer' }
}, { versionKey: false });

// Specify the collection name as the third argument to mongoose.model
const Account = mongoose.model('Account', accountSchema, 'Accounts'); 

module.exports = Account;
