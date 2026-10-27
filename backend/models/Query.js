import mongoose from 'mongoose';

const QuerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name']
  },
  email: {
    type: String,
    required: [true, 'Please add your email']
  },
  phone: {
    type: String
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  message: {
    type: String,
    required: [true, 'Please add your message']
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'resolved'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Query', QuerySchema);
