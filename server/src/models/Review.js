import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Please provide rating'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, 'Please provide review title'],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, 'Please provide review comment'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Review', reviewSchema);
