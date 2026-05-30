const Product = require('../models/Product');
const Entrepreneur = require('../models/Entrepreneur');
const Review = require('../models/Review');

exports.getProducts = async (req, res) => {
  const { category, minPrice, maxPrice, search, entrepreneurId, page = 1, limit = 12 } = req.query;
  const query = { isAvailable: true };
  if (category) query.category = category;
  if (entrepreneurId) query.entrepreneur = entrepreneurId;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate({ path: 'entrepreneur', populate: { path: 'user', select: 'name' } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  res.json({ success: true, products, total, page: parseInt(page), pages: Math.ceil(total / limit) });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({ path: 'entrepreneur', populate: { path: 'user', select: 'name email avatar' } });
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  const reviews = await Review.find({ product: product._id }).populate('reviewer', 'name avatar').sort({ createdAt: -1 });
  res.json({ success: true, product, reviews });
};

exports.createProduct = async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
  if (!entrepreneur) {
    res.status(404).json({ success: false, message: 'Entrepreneur profile not found' });
    return;
  }
  const product = await Product.create({ entrepreneur: entrepreneur._id, ...req.body });
  res.status(201).json({ success: true, product });
};

exports.updateProduct = async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, entrepreneur: entrepreneur._id },
    req.body,
    { new: true }
  );
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  res.json({ success: true, product });
};

exports.deleteProduct = async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
  await Product.findOneAndDelete({ _id: req.params.id, entrepreneur: entrepreneur._id });
  res.json({ success: true, message: 'Product deleted' });
};
