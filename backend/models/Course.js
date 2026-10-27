import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a course description']
  },
  detailedDescription: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  totalDuration: {
    type: Number, // in minutes
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  discountedPrice: {
    type: Number,
    default: 0
  },
  milestones: {
    type: [String],
    default: []
  },
  schedule: [{
    time: { type: String, default: '' },
    activity: { type: String, default: '' }
  }],
  category: {
    type: String,
    default: 'development'
  },
  level: {
    type: String,
    default: 'beginner'
  },
  color: {
    type: String,
    default: 'brandMint'
  },
  order: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  bannerImageUrl: {
    type: String,
    default: ''
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  totalModules: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  totalEnrollments: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  },
  requirements: {
    type: [String],
    default: []
  },
  learningOutcomes: {
    type: [String],
    default: []
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: true
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

// Update the updatedAt field on save
CourseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Course', CourseSchema);
