const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  programme: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
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
  course: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = Timetable;
