const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const aviationApi = require('../utils/aviationApi');

/**
 * Create a new booking
 * @route POST /api/bookings
 * @access Private
 */
exports.createBooking = async (req, res) => {
    try {
        const {
            flightDetails,
            returnFlightDetails,
            passengers,
            contactDetails,
            tripType,
            paymentMethod,
            totalPrice
        } = req.body;

        // Validate required information
        if (!flightDetails || !passengers || !contactDetails || !paymentMethod || !totalPrice) {
            return res.status(400).json({
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            });
        }

        // Create booking
        const newBooking = await Booking.create({
            user: req.user.id,
            flightDetails,
            returnFlightDetails,
            passengers,
            contactDetails,
            tripType,
            paymentMethod,
            totalPrice,
            status: 'รอการชำระเงิน'
        });

        res.status(201).json({
            success: true,
            booking: newBooking
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการสร้างการจอง',
            error: error.message
        });
    }
};

/**
 * Get user's bookings
 * @route GET /api/bookings
 * @access Private
 */
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง',
            error: error.message
        });
    }
};

/**
 * Get booking details
 * @route GET /api/bookings/:id
 * @access Private
 */
exports.getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        // Check if booking exists
        if (!booking) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลการจอง' });
        }

        // Check if booking belongs to user or user is admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลการจองนี้'
            });
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Get booking details error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง',
            error: error.message
        });
    }
};

/**
 * Update booking status (payment confirmation)
 * @route PUT /api/bookings/:id/payment
 * @access Private
 */
exports.updateBookingPayment = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        // Check if booking exists
        if (!booking) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลการจอง' });
        }

        // Check if booking belongs to user
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลการจองนี้'
            });
        }

        // Update booking status to "ชำระเงินแล้ว"
        booking.status = 'ชำระเงินแล้ว';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'อัปเดตสถานะการชำระเงินสำเร็จ',
            booking
        });
    } catch (error) {
        console.error('Update booking payment error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงิน',
            error: error.message
        });
    }
};

/**
 * Cancel booking
 * @route PUT /api/bookings/:id/cancel
 * @access Private
 */
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        // Check if booking exists
        if (!booking) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลการจอง' });
        }

        // Check if booking belongs to user
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลการจองนี้'
            });
        }

        // Check if booking is already canceled
        if (booking.status === 'ยกเลิก') {
            return res.status(400).json({
                message: 'การจองนี้ถูกยกเลิกไปแล้ว'
            });
        }

        // Update booking status to "ยกเลิก"
        booking.status = 'ยกเลิก';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'ยกเลิกการจองสำเร็จ',
            booking
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการยกเลิกการจอง',
            error: error.message
        });
    }
};

/**
 * Get booking by reference number
 * @route GET /api/bookings/reference/:ref
 * @access Public
 */
exports.getBookingByReference = async (req, res) => {
    try {
        const { ref } = req.params;
        
        const booking = await Booking.findOne({ bookingReference: ref });

        // Check if booking exists
        if (!booking) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลการจอง' });
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Get booking by reference error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง',
            error: error.message
        });
    }
};