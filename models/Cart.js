const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
  itemType: { type: String, required: true }, 
  itemId: { type: String, required: true },  
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true } 
});

const cartSchema = new Schema({
  AccountID: { type: String, required: true, ref: 'Account' },
  items: [itemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
