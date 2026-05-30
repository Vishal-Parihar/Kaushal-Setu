const User = require('../models/User');
const Entrepreneur = require('../models/Entrepreneur');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400).json({ success: false, message: 'Email already registered' });
    return;
  }

  const allowedRoles = ['customer', 'entrepreneur'];
  const user = await User.create({
    name,
    email,
    password,
    phone: phone || '',
    role: allowedRoles.includes(role) ? role : 'customer',
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar || '' },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar || '' },
  });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  let entrepreneurProfile = null;
  if (user.role === 'entrepreneur') {
    entrepreneurProfile = await Entrepreneur.findOne({ user: user._id });
  }
  res.json({ success: true, user, entrepreneurProfile });
};

exports.updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, address },
    { new: true, runValidators: true }
  ).select('-password');
  res.json({ success: true, user });
};
