const mongoose = require('mongoose');

const entrepreneurSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  category: {
    type: String,
    enum: ['cobbler', 'potter', 'tailor', 'artisan', 'vendor', 'other'],
    required: true,
  },
  description: { type: String, maxlength: 1000 },
  skills: [{ type: String }],
  experience: { type: Number, default: 0 }, // years
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String,
    address: String,
  },
  profileImage: { type: String, default: '' },
  gallery: [{ type: String }],
  services: [
    {
      name: String,
      description: String,
      price: Number,
      unit: { type: String, default: 'per piece' },
    },
  ],
  availability: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Entrepreneur', entrepreneurSchema);
