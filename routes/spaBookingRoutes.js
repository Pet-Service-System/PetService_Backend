const express = require('express');
const router = express.Router();
const {createSpaBooking, getSpaBookings, getSpaBookingById, getSpaBookingsByAccountID, updateSpaBooking, deleteSpaBooking} = require('../controllers/spaBookingController');

router.post('/', createSpaBooking);
router.get('/', getSpaBookings);
router.get('/:id', getSpaBookingById);
router.get('/account/:accountId', getSpaBookingsByAccountID);
router.put('/:id', updateSpaBooking);
router.delete('/:id', deleteSpaBooking);

module.exports = router;
