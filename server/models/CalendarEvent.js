const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  semester: {
    type: Number
  },
  eventType: {
    type: String // e.g., 'Normal', 'Pre-Exam', 'Exam'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String
  },
  isAssumption: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
