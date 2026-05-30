const ServiceRequest = require('../models/ServiceRequest');
const Entrepreneur = require('../models/Entrepreneur');

exports.createRequest = async (req, res) => {
  const request = await ServiceRequest.create({ customer: req.user._id, ...req.body });
  const populated = await ServiceRequest.findById(request._id)
    .populate({ path: 'entrepreneur', populate: { path: 'user', select: 'name' } });
  res.status(201).json({ success: true, request: populated });
};

exports.getMyRequests = async (req, res) => {
  const requests = await ServiceRequest.find({ customer: req.user._id })
    .populate({ path: 'entrepreneur', populate: { path: 'user', select: 'name' } })
    .sort({ createdAt: -1 });
  res.json({ success: true, requests });
};

exports.getEntrepreneurRequests = async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
  if (!entrepreneur) {
    res.json({ success: true, requests: [] });
    return;
  }
  const requests = await ServiceRequest.find({ entrepreneur: entrepreneur._id })
    .populate('customer', 'name email phone')
    .sort({ createdAt: -1 });
  res.json({ success: true, requests });
};

exports.respondToRequest = async (req, res) => {
  const { status, entrepreneurResponse, agreedPrice } = req.body;
  const entrepreneur = await Entrepreneur.findOne({ user: req.user._id });
  const request = await ServiceRequest.findOneAndUpdate(
    { _id: req.params.id, entrepreneur: entrepreneur._id },
    { status, entrepreneurResponse, agreedPrice },
    { new: true }
  ).populate('customer', 'name email');
  if (!request) {
    res.status(404).json({ success: false, message: 'Request not found' });
    return;
  }
  res.json({ success: true, request });
};
