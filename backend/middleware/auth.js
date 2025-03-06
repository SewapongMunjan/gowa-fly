const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - only authenticated users can access
 */
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // Check if token exists in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({ 
                message: 'โปรดเข้าสู่ระบบเพื่อเข้าถึงข้อมูลนี้' 
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gowa-fly-secret');
        
        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                message: 'ไม่พบผู้ใช้งานที่เกี่ยวข้องกับโทเค็นนี้' 
            });
        }
        
        // Set user in request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ 
            message: 'ไม่ได้รับอนุญาตให้เข้าถึงข้อมูลนี้' 
        });
    }
};

/**
 * Admin middleware - only admin users can access
 */
exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลนี้ เฉพาะผู้ดูแลระบบเท่านั้น' 
        });
    }
};