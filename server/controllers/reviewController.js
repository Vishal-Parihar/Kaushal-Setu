const Review = require('../models/Review');
const Entrepreneur = require('../models/Entrepreneur');
const Product = require('../models/Product');

exports.addReview = async (req, res) => {
  const { entrepreneurId, productId, rating, comment } = req.body;
  const review = await Review.create({
    reviewer: req.user._id,
    entrepreneur: entrepreneurId || null,
    product: productId || null,
    rating,
    comment,
  });
  if (entrepreneurId) {
    const reviews = await Review.find({ entrepreneur: entrepreneurId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Entrepreneur.findByIdAndUpdate(entrepreneurId, { rating: avg.toFixed(1), totalReviews: reviews.length });
  }
  if (productId) {
    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avg.toFixed(1), totalReviews: reviews.length });
  }
  const populated = await Review.findById(review._id).populate('reviewer', 'name avatar');
  res.status(201).json({ success: true, review: populated });
};
