const express = require('express');
const router = express.Router();
const { getReplyByBookingId, createReply, updateReply, deleteReply } = require('../controllers/replyController');

// Create a new reply
router.post('/', createReply);

// Get all replies for a specific comment by CommentID
router.get('/comment/:CommentID', getReplyByBookingId);

// Update a reply
router.patch('/:id', updateReply);

// Delete a reply
router.delete('/:id', deleteReply);

module.exports = router;
