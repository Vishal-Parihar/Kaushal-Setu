const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
    return;
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    res.status(401).json({ success: false, message: 'User not found' });
    return;
  }
  req.user = user;
  next();
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403).json({ success: false, message: `Not authorized` });
    return;
  }
  next();
};

module.exports = { protect, authorize };