const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  ProductID: { type: String, required: true, unique: true },
  ProductName: { type: String, required: true },
  Price: { type: Number, required: true },
  Pet_type_Id: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
