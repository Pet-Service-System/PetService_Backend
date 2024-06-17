const express = require('express');
const router = express.Router();
const {createBooking, getAllBookings, getBookingById, getHotelBookingsByAccountID, updateBooking, deleteBooking} = require('../controllers/hotelBookingController');

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.get('/account/:accountId', getHotelBookingsByAccountID);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
