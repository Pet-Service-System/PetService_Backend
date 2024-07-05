const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema();

const CartSchema = new mongoose.Schema({
  AccountID: { type: String, ref: 'Account', required: true },
  Items: [{
    ProductID: { type: String, required: true, ref: 'Product' },
    ProductName: { type: String, required: true },
    Price: { type: Number, required: true },
    Quantity: { type: Number, required: true },
    ImageURL: { type: String, required: false },
    Status: { type: String, required: true },
  }],
}, { versionKey: false });

const Cart = mongoose.model('Cart', CartSchema, 'Carts');

module.exports = Cart;