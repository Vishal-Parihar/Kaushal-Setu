const User = require('../models/User');
const Entrepreneur = require('../models/Entrepreneur');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getAnalytics = async (req, res) => {
  const [totalUsers, totalEntrepreneurs, totalOrders, totalProducts, pendingApprovals] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Entrepreneur.countDocuments({ isApproved: true }),
    Order.countDocuments(),
    Product.countDocuments(),
    Entrepreneur.countDocuments({ isApproved: false }),
  ]);
  const recentOrders = await Order.find()
    .populate('customer', 'name')
    .populate('product', 'name price')
    .populate({ path: 'entrepreneur', populate: { path: 'user', select: 'name' } })
    .sort({ createdAt: -1 })
    .limit(10);
  const earningsAgg = await Order.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  res.json({
    success: true,
    stats: { totalUsers, totalEntrepreneurs, totalOrders, totalProducts, pendingApprovals, totalRevenue: earningsAgg[0]?.total || 0 },
    recentOrders,
  });
};

exports.getPendingEntrepreneurs = async (req, res) => {
  const entrepreneurs = await Entrepreneur.find({ isApproved: false })
    .populate('user', 'name email phone createdAt')
    .sort({ createdAt: -1 });
  res.json({ success: true, entrepreneurs });
};

exports.approveEntrepreneur = async (req, res) => {
  const { isApproved } = req.body;
  const entrepreneur = await Entrepreneur.findByIdAndUpdate(
    req.params.id,
    { isApproved },
    { new: true }
  ).populate('user', 'name email');
  if (!entrepreneur) {
    res.status(404).json({ success: false, message: 'Not found' });
    return;
  }
  res.json({ success: true, entrepreneur });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
};

exports.getAllEntrepreneurs = async (req, res) => {
  const entrepreneurs = await Entrepreneur.find()
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
  res.json({ success: true, entrepreneurs });
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('customer', 'name email')
    .populate('product', 'name price')
    .populate({ path: 'entrepreneur', populate: { path: 'user', select: 'name' } })
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
};
