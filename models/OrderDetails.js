const mongoose = require('mongoose');

const OrderDetailsSchema = new mongoose.Schema({
    OrderDetailsID: { type: String, required: true, unique: true },
    OrderID: { type: String, required: true, ref: 'Order' },
    OrderDetails: [{
    ProductID: { type: String, required: true, ref: 'Product' },
    Price: { type: Number, required: true },
    Quantity: { type: Number, required: true },
  }]
}, { versionKey: false },
);
const OrderDetails = mongoose.model('OrderDetails', orderSchema, 'OrderDetails');
  
module.exports = OrderDetails;