import Review from '../models/Review.js';
import Company from '../models/Company.js';

// @desc    Get company reviews
// @route   GET /api/companies/:id/reviews
// @access  Public
export const getCompanyReviews = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const reviews = await Review.find({ company: req.params.id })
      .populate('user', 'fullName avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add company review
// @route   POST /api/companies/:id/reviews
// @access  Private
export const createCompanyReview = async (req, res, next) => {
  try {
    const { rating, comment, title } = req.body;
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
    }

    const existingReview = await Review.findOne({
      company: req.params.id,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You already reviewed this company' });
    }

    const review = await Review.create({
      company: req.params.id,
      user: req.user.id,
      rating: Number(rating),
      comment,
      title: title || `Review by ${req.user.fullName}`,
    });

    await Company.calculateRating(req.params.id);

    const populatedReview = await Review.findById(review._id).populate('user', 'fullName avatar');

    res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};
