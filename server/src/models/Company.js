import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide company description'],
    },
    logo: {
      type: String,
      default: null,
    },
    logoText: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },
    website: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

// Calculate rating from reviews
companySchema.statics.calculateRating = async function (companyId) {
  const reviews = await mongoose.model('Review').find({ company: companyId });
  if (reviews.length === 0) {
    await this.findByIdAndUpdate(companyId, { rating: 0, reviewsCount: 0 });
    return;
  }

  const avgRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  await this.findByIdAndUpdate(companyId, { rating: avgRating, reviewsCount: reviews.length });
};

export default mongoose.model('Company', companySchema);
