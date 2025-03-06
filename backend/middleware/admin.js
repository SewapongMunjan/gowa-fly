const User = require('../models/User');

/**
 * Middleware to check if user has admin role
 * This should be used after the auth middleware
 */
const admin = async (req, res, next) => {
  try {
    // Check if user exists in request (set by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        message: 'ไม่ได้รับอนุญาต โปรดเข้าสู่ระบบก่อน'
      });
    }

    // Get fresh user data from database
    const user = await User.findById(req.user.id);

    // Check if user exists and has admin role
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        message: 'ไม่มีสิทธิ์เข้าถึงส่วนนี้ เฉพาะผู้ดูแลระบบเท่านั้น'
      });
    }

    // User is admin, proceed to next middleware
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์'
    });
  }
};

module.exports = admin;