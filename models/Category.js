const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryID: { type: String, required: true, unique: true, },
    name: { type: String, required: true, unique: true, },
    description: { type: String, },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
