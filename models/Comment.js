const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  CommentID: { type: String, required: true, unique: true },
  ProductID: { type: String, required: true, ref: 'Product' },
  AccountID: { type: String, required: true, ref: 'Account' },
  Rating: { type: Number, required: true, min: 1, max: 5 },
  CommentContent: { type: String, required: true },
  CommentDate: { type: Date, required: true },
  isReplied: { type: Boolean, required: true },
},{ versionKey: false });

const Comment = mongoose.model('Comment', commentSchema, 'Comments');
module.exports = Comment;
