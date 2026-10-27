import mongoose from 'mongoose';

const CourseEnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  progress: {
    type: Number, // 0-100
    default: 0
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'free'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: ''
  }
});

// Create compound index for efficient queries
CourseEnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Update the lastAccessedAt field on save
CourseEnrollmentSchema.pre('save', function(next) {
  this.lastAccessedAt = Date.now();
  
  // Calculate progress based on completed lessons
  if (this.completedLessons && this.completedLessons.length > 0) {
    // This will be updated when we fetch total lessons count
    // For now, we'll update it via API
  }
  
  next();
});

export default mongoose.model('CourseEnrollment', CourseEnrollmentSchema);