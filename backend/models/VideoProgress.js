import mongoose from 'mongoose';

const VideoProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  currentTime: {
    type: Number, // in seconds
    default: 0
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  percentage: {
    type: Number, // 0-100
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now
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

// Create compound index for efficient queries
VideoProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

// Update the updatedAt field on save
VideoProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate percentage if duration is available
  if (this.duration > 0) {
    this.percentage = Math.min(100, Math.round((this.currentTime / this.duration) * 100));
    
    // Mark as completed if watched more than 90%
    if (this.percentage >= 90) {
      this.isCompleted = true;
    }
  }
  
  next();
});

export default mongoose.model('VideoProgress', VideoProgressSchema);