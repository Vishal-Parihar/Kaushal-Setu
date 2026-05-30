const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  customer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepreneur', required: true },
  product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:     { type: Number, default: 1 },
  totalAmount:  { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  deliveryAddress: {
    name:    String,
    phone:   String,
    address: String,
    city:    String,
    pincode: String,
  },
  notes: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)