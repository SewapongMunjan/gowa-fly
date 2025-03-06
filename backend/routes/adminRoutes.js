const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All routes are protected with authentication and admin middleware
router.use(protect);
router.use(admin);

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Booking management
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:id', adminController.updateBookingStatus);
router.delete('/bookings/:id', adminController.deleteBooking);

module.exports = router;