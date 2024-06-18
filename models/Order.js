const mongoose = require('mongoose');

const OrderDetailsSchema = new mongoose.Schema({

    OrderDetails: [{
    ProductID: { type: String, required: true, ref: 'Product' },
    Price: { type: Number, required: true },
    Quantity: { type: Number, required: true },
  }]
}, { versionKey: false },
);
  
  
const orderSchema = new mongoose.Schema({
    OrderID: { type: String, required: true, unique: true },
    OrderDate: { type: Date, default: Date.now },
    phone: { type: String, required: true },
    Address: { type: String, required: true },
    Status: { type: String, required: true },
    TotalPrice: { type: Number, required: true },
    OrderDetails: [OrderDetailsSchema],
    AccountID: { type: String, required: true, ref: 'Account' },
  });

  
  const Order = mongoose.model('Order', orderSchema, 'Orders');
  
  module.exports = Order;