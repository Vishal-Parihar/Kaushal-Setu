const express = require('express');
const router = express.Router();
const { getEntrepreneurs, getEntrepreneur, createProfile, updateProfile, getMyProfile } = require('../controllers/entrepreneurController');
const { protect } = require('../middleware/auth');

router.get('/', getEntrepreneurs);
router.get('/me', protect, getMyProfile);
router.get('/:id', getEntrepreneur);
router.post('/', protect, createProfile);
router.put('/', protect, updateProfile);

module.exports = router;