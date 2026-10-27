import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  category: {
    type: String,
    enum: ['general', 'event', 'emergency', 'circular'],
    default: 'general'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'parents', 'teachers'],
    default: 'all'
  },
  attachmentUrl: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Announcement', AnnouncementSchema);
