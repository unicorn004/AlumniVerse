const express = require('express');
const { createEvent, getAllEvents, joinEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { isAlumni,isStudent } = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/', protect, isAlumni, createEvent);
router.get('/', protect, getAllEvents);
router.post('/:id/join', protect, joinEvent);

module.exports = router;