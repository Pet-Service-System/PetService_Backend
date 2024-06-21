const express = require('express');
const router = express.Router();
const { createPayment, verifyVNPayReturn } = require('../controllers/paymentVNPayController');

// Định tuyến cho createPayment
router.post('/create-payment-url', createPayment);

// Định tuyến cho verifyVNPayReturn
router.get('/vnpay-return', verifyVNPayReturn);

module.exports = router;
