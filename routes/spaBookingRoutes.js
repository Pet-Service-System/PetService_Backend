const express = require('express');
const router = express.Router();
const {createSpaBooking, getSpaBookings, getSpaBookingById, getSpaBookingsByAccountID, updateSpaBooking, checkBooking} = require('../controllers/spaBookingController');

router.post('/', createSpaBooking);
router.post('/check', checkBooking);
router.get('/', getSpaBookings);
router.get('/:id', getSpaBookingById);
router.get('/account/:accountId', getSpaBookingsByAccountID);
router.patch('/:id', updateSpaBooking);


module.exports = router;
