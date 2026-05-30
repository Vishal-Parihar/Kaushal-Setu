const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepreneur' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
