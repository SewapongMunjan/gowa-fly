const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

// Public routes
router.get('/search', flightController.searchFlights);
router.get('/popular', flightController.getPopularRoutes);
router.get('/status/:flightNumber', flightController.getFlightStatus);
router.get('/:id', flightController.getFlightDetails);

module.exports = router;