const express = require('express');
const { createEvent, getAllEvents, joinEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createEvent);
router.get('/', protect, getAllEvents);
router.post('/:id/join', protect, joinEvent);

module.exports = router;