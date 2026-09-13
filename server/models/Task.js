const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  studyBlock: {
    type: String
  },
  dayOfWeek: {
    type: String
  },
  date: {
    type: Date
  },
  week: {
    type: Number
  },
  month: {
    type: String
  },
  year: {
    type: Number
  },
  semester: {
    type: Number
  },
  category: {
    type: String
  },
  trackers: {
    type: [String], // Array of trackers (e.g., ["GATE", "Placement"])
    default: []
  },
  subject: {
    type: String
  },
  topic: {
    type: String
  },
  stage: {
    type: String
  },
  estimatedTime: {
    type: Number, // In minutes
    required: true,
    default: 30
  },
  resources: [{
    name: String,
    type: { type: String }, // 'type' is a reserved keyword in Mongoose schemas, so we nest it
    url: String
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'paused', 'deferred'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  targetDeadline: {
    type: Date
  },
  tags: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
