const express = require('express');
const router = express.Router();
const { getAnalytics, getPendingEntrepreneurs, approveEntrepreneur, getAllUsers, getAllEntrepreneurs, getAllOrders } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/pending-entrepreneurs', getPendingEntrepreneurs);
router.put('/entrepreneurs/:id/approve', approveEntrepreneur);
router.get('/users', getAllUsers);
router.get('/entrepreneurs', getAllEntrepreneurs);
router.get('/orders', getAllOrders);

module.exports = router;