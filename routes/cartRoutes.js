const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.createCart);
router.post('/add', cartController.addItemToCart);
router.post('/remove', cartController.removeItemFromCart);
router.get('/:AccountID', cartController.viewCart);
router.delete('/:AccountID', cartController.clearCart);

module.exports = router;
