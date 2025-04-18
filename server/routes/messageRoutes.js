const express = require('express');
const { sendMessage, getMessagesWithUser } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:userId', protect, getMessagesWithUser);

module.exports = router;