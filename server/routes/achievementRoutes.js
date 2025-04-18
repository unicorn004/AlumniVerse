const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAlumni } = require('../middleware/roleMiddleware');

const {
  addAchievement,
  getMyAchievements,
  deleteAchievement
} = require('../controllers/achievementController');

// Alumni only
router.get('/me', protect, isAlumni, getMyAchievements);
router.post('/', protect, isAlumni, addAchievement);
router.delete('/:achvId', protect, isAlumni, deleteAchievement);

module.exports = router;