const express = require('express');
const {createComment, getCommentsByProductId, updateComment, deleteComment} = require('../controllers/commentController');
const router = express.Router();

router.post('/', createComment);
router.get('/comments/product/:ProductID', getCommentsByProductId);
router.put('/:CommentID', updateComment);
router.delete('/:CommentID', deleteComment);

module.exports = router;
