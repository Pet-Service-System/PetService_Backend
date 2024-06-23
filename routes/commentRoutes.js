const express = require('express');
const {createComment, getCommentsByProductId, updateComment, deleteComment, addCommentDetail} = require('../controllers/commentController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createComment);
router.get('/product/:ProductID', getCommentsByProductId);
router.put('/:CommentID', authMiddleware, updateComment);
router.delete('/:CommentID', authMiddleware, deleteComment);
router.post('/product/:ProductID', authMiddleware, addCommentDetail);
module.exports = router;
