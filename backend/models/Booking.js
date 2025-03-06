const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['ผู้ใหญ่', 'เด็ก', 'ทารก'],
        required: true
    },
    title: {
        type: String,
        enum: ['นาย', 'นาง', 'นางสาว', 'ด.ช.', 'ด.ญ.'],
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    passportNumber: {
        type: String,
        trim: true
    },
    passportExpiry: {
        type: Date
    }
});

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flightDetails: {
        flightNumber: {
            type: String,
            required: true
        },
        airline: {
            type: String,
            required: true
        },
        departureAirport: {
            type: String,
            required: true
        },
        arrivalAirport: {
            type: String,
            required: true
        },
        departureTime: {
            type: Date,
            required: true
        },
        arrivalTime: {
            type: Date,
            required: true
        },
        flightDuration: {
            type: String,
            required: true
        },
        apiFlightId: {
            type: String
        }
    },
    returnFlightDetails: {
        flightNumber: String,
        airline: String,
        departureAirport: String,
        arrivalAirport: String,
        departureTime: Date,
        arrivalTime: Date,
        flightDuration: String,
        apiFlightId: String
    },
    passengers: [passengerSchema],
    contactDetails: {
        email: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        }
    },
    tripType: {
        type: String,
        enum: ['เที่ยวเดียว', 'ไป-กลับ'],
        required: true
    },
    status: {
        type: String,
        enum: ['รอการชำระเงิน', 'ชำระเงินแล้ว', 'ยกเลิก', 'เสร็จสิ้น'],
        default: 'รอการชำระเงิน'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['บัตรเครดิต', 'โอนเงิน', 'พร้อมเพย์'],
        required: true
    },
    bookingReference: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Generate booking reference
bookingSchema.pre('save', function(next) {
    if (!this.bookingReference) {
        // Generate a random 6-character alphanumeric code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let reference = '';
        for (let i = 0; i < 6; i++) {
            reference += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.bookingReference = reference;
    }
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;