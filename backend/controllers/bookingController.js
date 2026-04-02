const Booking = require('../models/Booking');
const Timetable = require('../models/Timetable');

const getBookings = async (req, res) => {
  try {
    // Only fetch bookings that haven't expired
    const activeBookings = await Booking.find({ expiresAt: { $gt: new Date() } });
    
    // Map _id to id for frontend compatibility
    const formatted = activeBookings.map(b => {
      const obj = b.toObject();
      obj.id = obj._id.toString();
      delete obj._id;
      return obj;
    });
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

const createBooking = async (req, res) => {
  const { roomId, day, period, bookedBy, programme, purpose } = req.body;

  if (!roomId || !day || !period || !bookedBy || !programme || !purpose) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 1. Check if room is already used in regular timetable at this time
    const timetableConflict = await Timetable.findOne({
      day,
      period,
      resource: roomId
    });

    if (timetableConflict) {
      return res.status(409).json({ 
        success: false, 
        error: `Room ${roomId} is occupied by ${timetableConflict.course} (${timetableConflict.programme})` 
      });
    }

    // 2. Check if active booking exists
    const bookingConflict = await Booking.findOne({
      roomId,
      day,
      period,
      expiresAt: { $gt: new Date() }
    });

    if (bookingConflict) {
      return res.status(409).json({
        success: false,
        error: `Room ${roomId} is already booked for ${bookingConflict.purpose}`
      });
    }

    // 3. Create booking with 10 min expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const newBooking = new Booking({
      roomId, day, period, bookedBy, programme, purpose, expiresAt
    });

    await newBooking.save();
    
    const responseObj = newBooking.toObject();
    responseObj.id = responseObj._id.toString();
    delete responseObj._id;

    res.status(201).json({ success: true, booking: responseObj });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await Booking.findByIdAndDelete(id);
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

module.exports = { getBookings, createBooking, cancelBooking };
