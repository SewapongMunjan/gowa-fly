const User = require('../models/User');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

/**
 * Get all users
 * @route GET /api/admin/users
 * @access Private/Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
            error: error.message
        });
    }
};

/**
 * Get user by ID
 * @route GET /api/admin/users/:id
 * @access Private/Admin
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
            error: error.message
        });
    }
};

/**
 * Update user
 * @route PUT /api/admin/users/:id
 * @access Private/Admin
 */
exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, role } = req.body;
        
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }
        
        // Update user details
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.role = role || user.role;
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้',
            error: error.message
        });
    }
};

/**
 * Delete user
 * @route DELETE /api/admin/users/:id
 * @access Private/Admin
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }
        
        // Check if user is an admin
        if (user.role === 'admin') {
            return res.status(400).json({
                message: 'ไม่สามารถลบบัญชีผู้ดูแลระบบได้'
            });
        }
        
        await user.remove();
        
        res.status(200).json({
            success: true,
            message: 'ลบผู้ใช้สำเร็จ'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการลบผู้ใช้',
            error: error.message
        });
    }
};

/**
 * Get all bookings
 * @route GET /api/admin/bookings
 * @access Private/Admin
 */
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง',
            error: error.message
        });
    }
};

/**
 * Update booking status
 * @route PUT /api/admin/bookings/:id
 * @access Private/Admin
 */
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลการจอง' });
        }
        
        // Update booking status
        booking.status = status || booking.status;
        await booking.save();
        
        res.status(200).json({
            success: true,
            message: 'อัปเดตสถานะการจองสำเร็จ',
            booking
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะการจอง',
            error: error.message
        });
    }
};

/**
 * Delete booking
 * @route DELETE /api/admin/bookings/:id
 * @access Private/Admin
 */
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลการจอง' });
        }
        
        await booking.remove();
        
        res.status(200).json({
            success: true,
            message: 'ลบข้อมูลการจองสำเร็จ'
        });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการลบข้อมูลการจอง',
            error: error.message
        });
    }
};

/**
 * Get dashboard statistics
 * @route GET /api/admin/stats
 * @access Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total users
        const totalUsers = await User.countDocuments();
        
        // Get total bookings
        const totalBookings = await Booking.countDocuments();
        
        // Get total revenue
        const bookings = await Booking.find({ status: 'ชำระเงินแล้ว' });
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
        
        // Get booking status counts
        const pendingPayment = await Booking.countDocuments({ status: 'รอการชำระเงิน' });
        const paid = await Booking.countDocuments({ status: 'ชำระเงินแล้ว' });
        const cancelled = await Booking.countDocuments({ status: 'ยกเลิก' });
        const completed = await Booking.countDocuments({ status: 'เสร็จสิ้น' });
        
        // Get recent bookings
        const recentBookings = await Booking.find()
            .populate('user', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(5);
        
        // Get booking trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const bookingTrends = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalBookings,
                totalRevenue,
                bookingStatusCounts: {
                    pendingPayment,
                    paid,
                    cancelled,
                    completed
                },
                recentBookings,
                bookingTrends
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ',
            error: error.message
        });
    }
};