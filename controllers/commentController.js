const Comment = require('../models/Comment');
const Product = require('../models/Product');  
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create a new comment
exports.createComment = async (req, res) => {
  const { CommentID, ProductID, CommentDetails } = req.body;

  try {
    const newComment = new Comment({ CommentID, ProductID, CommentDetails });
    await newComment.save();

    // Update average rating for the product
    await updateAverageRating(ProductID);

    res.status(201).json({ message: 'Comment created successfully', comment: newComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get comments by ProductID
exports.getCommentsByProductId = async (req, res) => {
    const { ProductID } = req.params;
  
    try {
      const comments = await Comment.find({ ProductID: ProductID });
      if (comments.length === 0) {
        return res.status(404).json({ message: 'No comments found for this product' });
      }
  
      res.json({ comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

// Update a comment by CommentID
exports.updateComment = async (req, res) => {
  const { CommentID } = req.params;
  const { ProductID, CommentDetails } = req.body;

  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { CommentID },
      { ProductID, CommentDetails },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Update average rating for the product
    await updateAverageRating(ProductID);

    res.json({ message: 'Comment updated successfully', comment: updatedComment });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a comment by CommentID
exports.deleteComment = async (req, res) => {
  const { CommentID } = req.params;

  try {
    const comment = await Comment.findOneAndDelete({ CommentID });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Update average rating for the product
    await updateAverageRating(comment.ProductID);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a new comment detail
exports.addCommentDetail = async (req, res) => {
  const { ProductID } = req.params;
  const { AccountID, Rating, Comment } = req.body;

  if (!AccountID || !Rating || !Comment) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    const comment = await Comment.findOne({ProductID: ProductID });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const newCommentDetail = { AccountID, Rating, Comment };
    comment.CommentDetails.push(newCommentDetail);
    await comment.save();

    // Update average rating for the product
    await updateAverageRating(comment.ProductID);

    res.status(201).json({ message: 'Comment detail added successfully', comment });
  } catch (error) {
    console.error('Error adding comment detail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};