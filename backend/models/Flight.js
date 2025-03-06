const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
        trim: true
    },
    airline: {
        name: {
            type: String,
            required: true
        },
        iataCode: {
            type: String,
            required: true
        },
        logo: {
            type: String
        }
    },
    departure: {
        airport: {
            type: String,
            required: true
        },
        iataCode: {
            type: String,
            required: true
        },
        terminal: String,
        gate: String,
        scheduledTime: {
            type: Date,
            required: true
        },
        estimatedTime: Date,
        actualTime: Date,
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    arrival: {
        airport: {
            type: String,
            required: true
        },
        iataCode: {
            type: String,
            required: true
        },
        terminal: String,
        gate: String,
        scheduledTime: {
            type: Date,
            required: true
        },
        estimatedTime: Date,
        actualTime: Date,
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: [
            'จองแล้ว',
            'ยกเลิก',
            'ดีเลย์',
            'เที่ยวบินเข้า',
            'เที่ยวบินออก',
            'อยู่ระหว่างเดินทาง',
            'ถึงที่หมายแล้ว',
            'เปลี่ยนเส้นทาง',
            'ไม่ทราบสถานะ'
        ],
        default: 'ไม่ทราบสถานะ'
    },
    aircraft: {
        model: String,
        registration: String
    },
    duration: {
        type: Number,  // Duration in minutes
        required: true
    },
    price: {
        economy: {
            type: Number,
            required: true
        },
        business: Number,
        firstClass: Number
    },
    seatsAvailable: {
        economy: {
            type: Number,
            default: 100
        },
        business: {
            type: Number,
            default: 20
        },
        firstClass: {
            type: Number,
            default: 10
        }
    },
    apiFlightId: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
flightSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;