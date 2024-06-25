const mongoose = require('mongoose');
 
const orderSchema = new mongoose.Schema({
    OrderID: { type: String, required: true, unique: true },
    OrderDate: { type: Date, default: Date.now },
    Name: { type: String, required: true },
    Phone: { type: String, required: true },
    Address: { type: String, required: true },
    Status: { type: String, required: true },
    TotalPrice: { type: Number, required: true },
    AccountID: { type: String, required: true, ref: 'Account' },
  }, { versionKey: false },);

  
  const Order = mongoose.model('Order', orderSchema, 'Orders');
  
  module.exports = Order;