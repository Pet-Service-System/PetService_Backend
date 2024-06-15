const express = require('express');
const router = express.Router();
const spaBookingController = require('../controllers/spaBookingController');

router.post('/', spaBookingController.createSpaBooking);
router.get('/', spaBookingController.getSpaBookings);
router.get('/:id', spaBookingController.getSpaBookingById);
router.put('/:id', spaBookingController.updateSpaBooking);
router.delete('/:id', spaBookingController.deleteSpaBooking);

module.exports = router;
