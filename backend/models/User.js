const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'กรุณากรอกชื่อจริง'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'กรุณากรอกนามสกุล'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'กรุณากรอกอีเมล'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'กรุณากรอกอีเมลที่ถูกต้อง']
    },
    password: {
        type: String,
        required: [true, 'กรุณากรอกรหัสผ่าน'],
        minlength: [6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร']
    },
    phoneNumber: {
        type: String,
        required: [true, 'กรุณากรอกเบอร์โทรศัพท์'],
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add method to check if user is admin
userSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

const User = mongoose.model('User', userSchema);

module.exports = User;