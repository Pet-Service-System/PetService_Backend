const express = require('express');
const router = express.Router();
const {getCart, addToCart, updateCartItem, removeCartItem} = require('../controllers/cartController');
const {authMiddleware} = require('../middlewares/authMiddleware');

router.get('/:AccountID', getCart);
router.post('/', authMiddleware, addToCart);
router.put('/', authMiddleware, updateCartItem);
router.delete('/', authMiddleware, removeCartItem);

module.exports = router;
