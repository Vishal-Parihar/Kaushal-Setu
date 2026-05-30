const Order = require('../models/Order')
const Product = require('../models/Product')
const Entrepreneur = require('../models/Entrepreneur')

exports.placeOrder = async (req, res) => {
  const { productId, quantity, deliveryAddress, notes } = req.body

  const product = await Product.findById(productId)
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' })
    return
  }

  const totalAmount = product.price * (quantity || 1)

  const order = new Order({
    customer: req.user._id,
    entrepreneur: product.entrepreneur,
    product: productId,
    quantity: quantity || 1,
    totalAmount,
    deliveryAddress,
    notes,
  })

  await order.save()

  const populated = await Order.findById(order._id)
    .populate('product', 'name images price')
    .populate({ path: 'entrepreneur', populate: { path: 'user', select: 'name phone' } })

  res.status(201).json({ success: true, order: populated })
}

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate('product', 'name images price')
    .populate({ path: 'entrepreneur', populate: { path: 'user', select: 'name' } })
    .sort({ createdAt: -1 })
  res.json({ success: true, orders })
}

exports.getEntrepreneurOrders = async (req, res) => {
  const entrepreneur = await Entrepreneur.findOne({ user: req.user._id })
  if (!entrepreneur) {
    res.json({ success: true, orders: [] })
    return
  }
  const orders = await Order.find({ entrepreneur: entrepreneur._id })
    .populate('product', 'name images price')
    .populate('customer', 'name email phone')
    .sort({ createdAt: -1 })
  res.json({ success: true, orders })
}

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body
  const entrepreneur = await Entrepreneur.findOne({ user: req.user._id })
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, entrepreneur: entrepreneur._id },
    { status },
    { new: true }
  ).populate('product', 'name')
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' })
    return
  }
  if (status === 'completed') {
    await Entrepreneur.findByIdAndUpdate(entrepreneur._id, { $inc: { earnings: order.totalAmount } })
  }
  res.json({ success: true, order })
}