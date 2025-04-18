const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAlumni } = require('../middleware/roleMiddleware');
const {
  addAchievement,
  getAchievements,
  deleteAchievement
} = require('../controllers/achievementController');

router.get('/:id', getAchievements);

// Alumni only
router.post('/', protect, isAlumni, addAchievement);
router.delete('/:achvId', protect, isAlumni, deleteAchievement);

module.exports = router;