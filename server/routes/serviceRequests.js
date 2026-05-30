const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, getEntrepreneurRequests, respondToRequest } = require('../controllers/serviceRequestController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/entrepreneur', protect, getEntrepreneurRequests);
router.put('/:id/respond', protect, respondToRequest);

module.exports = router;