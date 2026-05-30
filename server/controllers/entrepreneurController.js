const Entrepreneur = require('../models/Entrepreneur');
const User = require('../models/User');
const Review = require('../models/Review');

exports.getEntrepreneurs = async (req, res) => {
  const { category, city, search, page = 1, limit = 12 } = req.query;
  const query = { isApproved: true, isActive: true };
  if (category) query.category = category;
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (search) {
    query.$or = [
      { businessName: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { skills: { $in: [new RegExp(search, 'i')] } },
    ];
  }
  const total = await Entrepreneur.countDocuments(query);
  const entrepreneurs = await Entrepreneur.find(query)
    .populate('user', 'name email avatar phone')
    .sort({ rating: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  res.json({ success: true, entrepreneurs, total, page: parseInt(page), pages: Math.ceil(total / limit) });
};

exports.getEntrepreneur = async (req, res) => {
  const entrepreneur = await Entrepreneur.findById(req.params.id).populate('user', 'name email avatar phone');
  if (!entrepreneur) {
    res.status(404).json({ success: false, message: 'Entrepreneur not found' });
    return;
  }
  const reviews = await Review.find({ entrepreneur: entrepreneur._id })
    .populate('reviewer', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(10);
  res.json({ success: true, entrepreneur, reviews });
};

exports.createProfile = async (req, res) => {
  const exists = await Entrepreneur.findOne({ user: req.user._id });
  if (exists) {
    res.status(400).json({ success: false, message: 'Profile already exists' });
    return;
  }
  const entrepreneur = await Entrepreneur.create({ user: req.user._id, ...req.body });
  await User.findByIdAndUpdate(req.user._id, { role: 'entrepreneur' });
  res.status(201).json({ success: true, entrepreneur });
};

exports.updateProfile = async (req, res) => {
  const entrepreneur = await Entrepreneur.findOneAndUpdate(
    { user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!entrepreneur) {
    res.status(404).json({ success: false, message: 'Profile not found' });
    return;
  }
  res.json({ success: true, entrepreneur });
};

exports.getMyProfile = async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({ user: req.user._id }).populate('user', 'name email avatar phone');
  if (!entrepreneur) {
    res.status(404).json({ success: false, message: 'Profile not found' });
    return;
  }
  res.json({ success: true, entrepreneur });
};
