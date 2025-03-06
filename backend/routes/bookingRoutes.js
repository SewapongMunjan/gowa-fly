const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// Public route for checking booking by reference number
router.get('/reference/:ref', bookingController.getBookingByReference);

// Protected routes
router.post('/', protect, bookingController.createBooking);
router.get('/', protect, bookingController.getUserBookings);
router.get('/:id', protect, bookingController.getBookingDetails);
router.put('/:id/payment', protect, bookingController.updateBookingPayment);
router.put('/:id/cancel', protect, bookingController.cancelBooking);

module.exports = router;