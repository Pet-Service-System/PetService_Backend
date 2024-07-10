const express = require('express');
const router = express.Router();
const { getReplyByCommentId, createReply, getRepliesByComment, updateReply, deleteReply } = require('../controllers/replyController');

// Create a new reply
router.post('/', createReply);

// Get all replies for a specific comment by CommentID
router.get('/comment/:CommentID', getReplyByCommentId);

// Update a reply
router.patch('/:id', updateReply);

// Delete a reply
router.delete('/:id', deleteReply);

module.exports = router;
