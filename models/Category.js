const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    CategoryID: { type: String, required: true, unique: true, },
    Name: { type: String, required: true, unique: true, },
    Description: { type: String, },
});

const Category = mongoose.model('Category', categorySchema, 'Categories');

module.exports = Category;
