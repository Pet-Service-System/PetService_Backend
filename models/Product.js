const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  ProductID: { type: String, required: true, unique: true },
  ProductName: { type: String, required: true },
  Price: { type: Number, required: true },
  PetTypeId : { type: String, required: true, ref: 'PetType' },
  Description: { type: String, required: true },
  ImageURL: { type: String, required: true },
  Status: { type: String, required: true }
}, { versionKey: false });

const Product = mongoose.model('Product', productSchema, 'Products');

module.exports = Product;
