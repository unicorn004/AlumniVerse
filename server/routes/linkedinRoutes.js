const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { syncLinkedIn } = require('../controllers/linkedinController');

router.post('/sync', protect, syncLinkedIn);

module.exports = router;