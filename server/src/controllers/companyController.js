import Company from '../models/Company.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getAllCompanies = async (req, res, next) => {
  try {
    const { search, city, sortBy = 'name' } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    let sortOption = {};
    switch (sortBy) {
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'reviews':
        sortOption = { reviewsCount: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { name: 1 };
    }

    const companies = await Company.find(query)
      .populate('createdBy', 'fullName email')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
export const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('createdBy', 'fullName email');

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create company
// @route   POST /api/companies
// @access  Private
export const createCompany = async (req, res, next) => {
  try {
    const { name, description, city, state, country, website, email, phone, industry, logoText } = req.body;

    // Validate required fields
    if (!name || !description || !city) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide name, description, and city' });
    }

    let company = await Company.findOne({ name });
    if (company) {
      return res.status(400).json({ success: false, message: 'Company already exists' });
    }

    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    company = await Company.create({
      name,
      description,
      logo,
      logoText: logoText || name.charAt(0).toUpperCase(),
      city,
      state,
      country,
      website,
      email,
      phone,
      industry,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private
export const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Check if user is the creator or admin
    if (company.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to update this company' });
    }

    const { name, description, city, state, country, website, email, phone, industry, logoText } = req.body;

    company = await Company.findByIdAndUpdate(
      req.params.id,
      {
        name: name || company.name,
        description: description || company.description,
        city: city || company.city,
        state: state || company.state,
        country: country || company.country,
        website: website || company.website,
        email: email || company.email,
        phone: phone || company.phone,
        industry: industry || company.industry,
        logoText: logoText || company.logoText,
        ...(req.file && { logo: `/uploads/${req.file.filename}` }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private
export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Check if user is the creator or admin
    if (company.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to delete this company' });
    }

    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's companies
// @route   GET /api/companies/user/mycompanies
// @access  Private
export const getUserCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ createdBy: req.user.id }).populate('createdBy', 'fullName email');

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};
