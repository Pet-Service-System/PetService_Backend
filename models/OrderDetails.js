const mongoose = require('mongoose');

const OrderDetailsSchema = new mongoose.Schema({
    OrderDetailsID: { type: String, required: true, unique: true },
    OrderID: { type: String, required: true, ref: 'Order' },
    CustomerName: { type: String, required: true },
    Phone: { type: String, required: true },
    Address: { type: String, required: true },
    AccountID: { type: String, required: true, ref: 'Account' },
    OrderDetails: [{
    ProductID: { type: String, required: true, ref: 'Product' },
    Price: { type: Number, required: true },
    Quantity: { type: Number, required: true },
  }],
}, { versionKey: false },
);
const OrderDetails = mongoose.model('OrderDetails', OrderDetailsSchema, 'OrderDetails');
  
module.exports = OrderDetails;