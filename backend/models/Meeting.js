import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a meeting title']
  },
  description: {
    type: String,
    default: ''
  },
  startTime: {
    type: Date,
    required: [true, 'Please add a meeting start time']
  },
  durationMinutes: {
    type: Number,
    default: 60
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  hostName: {
    type: String,
    default: ''
  },
  hostRole: {
    type: String,
    enum: ['admin', 'teacher', 'parent'],
    default: 'admin'
  },
  joinUrl: {
    type: String,
    required: [true, 'Please add a meeting join URL']
  },
  // Stores a Google Calendar event id when a Meet link is auto-provisioned via
  // the Calendar API; empty for manually entered Meet links.
  conferenceId: {
    type: String,
    default: ''
  },
  targetAudience: {
    type: String,
    enum: ['all', 'parents', 'teachers'],
    default: 'all'
  },
  classFilter: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Meeting', MeetingSchema);
