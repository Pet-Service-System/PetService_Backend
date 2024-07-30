const express = require('express');
const router = express.Router();
const { createBooking, getSpaBookings, getBookingById, checkBooking, getSpaBookingsByAccountID, updateBooking } = require('../controllers/spaBookingController');


router.post('/', createBooking);


router.get('/', getSpaBookings);


router.get('/:id', getBookingById);


router.post('/check', checkBooking);


router.get('/account/:accountId', getSpaBookingsByAccountID);


router.put('/:id', updateBooking);


module.exports = router;
