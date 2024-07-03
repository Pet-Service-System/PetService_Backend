const express = require('express');
const {countAvailableAccounts, countCompletedOrders, countCompletedBookings, countTopThreeProducts} = require('../controllers/dashboardController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/count-available-accounts', countAvailableAccounts);
router.get('/count-completed-orders', countCompletedOrders);
router.get('/count-completed-bookings', countCompletedBookings);
router.get('/most-ordered-products', countTopThreeProducts);

module.exports = router;