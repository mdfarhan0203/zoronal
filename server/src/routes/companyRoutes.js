import express from 'express';
import {
  getAllCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getUserCompanies,
} from '../controllers/companyController.js';
import { createCompanyReview, getCompanyReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllCompanies);
router.get('/user/mycompanies', protect, getUserCompanies);
router.get('/:id', getCompany);
router.get('/:id/reviews', getCompanyReviews);

// Private routes
router.post('/', protect, upload.single('logo'), createCompany);
router.put('/:id', protect, upload.single('logo'), updateCompany);
router.delete('/:id', protect, deleteCompany);
router.post('/:id/reviews', protect, createCompanyReview);

export default router;
