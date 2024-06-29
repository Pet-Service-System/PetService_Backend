const express = require('express');
const router = express.Router();
const {getCart, addToCart, updateCartItem, removeCartItem} = require('../controllers/cartController');
const {authMiddleware} = require('../middlewares/authMiddleware');

router.get('/:accountId', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.put('/update', authMiddleware, updateCartItem);
router.delete('/remove', authMiddleware, removeCartItem);

module.exports = router;
