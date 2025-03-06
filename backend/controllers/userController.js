const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 * @route POST /api/users/register
 * @access Public
 */
exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        // Create new user (without hashing password as per requirement)
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password, // Note: In a real application, password should be hashed
            phoneNumber,
            role: 'user' // Default role
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || 'gowa-fly-secret',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Register user error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน', error: error.message });
    }
};

/**
 * Login user
 * @route POST /api/users/login
 * @access Public
 */
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // Check password (without hashing as per requirement)
        if (user.password !== password) {
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'gowa-fly-secret',
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            token,
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
        console.error('Login user error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
    }
};

/**
 * Get current user profile
 * @route GET /api/users/profile
 * @access Private
 */
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
exports.updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                firstName,
                lastName,
                phoneNumber
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }

        res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์', error: error.message });
    }
};

/**
 * Change user password
 * @route PUT /api/users/password
 * @access Private
 */
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }

        // Check current password (without hashing as per requirement)
        if (user.password !== currentPassword) {
            return res.status(401).json({ message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
        }

        // Update password (without hashing as per requirement)
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'เปลี่ยนรหัสผ่านสำเร็จ'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', error: error.message });
    }
};