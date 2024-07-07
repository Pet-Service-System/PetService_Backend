const express = require('express');
const {createVoucher, getAllVouchers, getVoucherById, updateVoucher, deleteVoucher} = require('../controllers/voucherController');

const router = express.Router();

// Create a new voucher
router.post('/', createVoucher);

// Get all vouchers
router.get('/', getAllVouchers);

// Get a voucher by ID
router.get('/:id', getVoucherById);

// Update a voucher by ID
router.put('/:id', updateVoucher);

// Delete a voucher by ID
router.delete('/:id', deleteVoucher);

module.exports = router;
