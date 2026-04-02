const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  period: {
    type: Number,
    required: true
  },
  bookedBy: {
    type: String,
    required: true
  },
  programme: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'active'
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Auto expire active bookings using TTL index on expiresAt (MongoDB feature)
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
