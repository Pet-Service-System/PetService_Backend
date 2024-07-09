const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create_payment', paymentController.createPayment);
router.get('/vnpay_return', paymentController.returnPayment);

module.exports = router;
