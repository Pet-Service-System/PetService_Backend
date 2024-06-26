const express = require('express');
const router = express.Router();
const {createBookingDetail, getAllBookingDetails, getBookingDetailById, getBookingDetailByBookingId, updateBookingDetailById, deleteBookingDetailById} = require('../controllers/spaBookingDetailsController');
const {authMiddleware} = require('../middlewares/authMiddleware');
// Create a new spa booking detail
router.post('/', authMiddleware, createBookingDetail);

// Get all spa booking details
router.get('/', authMiddleware, getAllBookingDetails);

// Get a single spa booking detail by ID
router.get('/:id', authMiddleware, getBookingDetailById);

// Get a single spa booking detail by BookingID
router.get('/booking/:bookingId', authMiddleware, getBookingDetailByBookingId);

// Update a spa booking detail by ID
router.put('/:id', authMiddleware, updateBookingDetailById);

// Delete a spa booking detail by ID
router.delete('/:id', authMiddleware, deleteBookingDetailById);

module.exports = router;
