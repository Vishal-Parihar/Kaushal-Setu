const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addReview);

module.exports = router;