const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getEntrepreneurOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/entrepreneur', protect, getEntrepreneurOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;