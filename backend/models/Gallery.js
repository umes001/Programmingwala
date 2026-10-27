import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a gallery title']
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  url: {
    type: String,
    required: [true, 'Please add media URL']
  },
  category: {
    type: String,
    enum: ['events', 'sports', 'classroom', 'celebrations'],
    default: 'events'
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

export default mongoose.model('Gallery', GallerySchema);
