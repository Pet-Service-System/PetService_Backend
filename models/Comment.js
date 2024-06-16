const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentDetailsSchema = new Schema({
  AccountID: { type: String, required: true, ref: 'Account' },
  Rating: { type: Number, required: true, min: 1, max: 5 },
  Comment: { type: String, required: true },
} , { versionKey: false });

const commentSchema = new Schema({
  CommentID: { type: String, required: true, unique: true },
  ProductID: { type: String, required: true, ref: 'Product' },
  CommentDetails: [commentDetailsSchema],
},{ versionKey: false });

const Comment = mongoose.model('Comment', commentSchema, 'Comments');
module.exports = Comment;
