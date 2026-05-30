const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepreneur', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, default: 1 },
  unit: { type: String, default: 'piece' },
  tags: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
