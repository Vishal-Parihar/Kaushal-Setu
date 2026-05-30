const mongoose = require('mongoose')

const serviceRequestSchema = new mongoose.Schema({
  customer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepreneur', required: true },
  serviceType:  { type: String, required: true },
  description:  { type: String, required: true },
  preferredDate: { type: Date },
  location:     { type: String },
  budget:       { type: Number },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  entrepreneurResponse: { type: String },
  agreedPrice:          { type: Number },
}, { timestamps: true })

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema)