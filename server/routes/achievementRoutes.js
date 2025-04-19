const express = require('express');
const {
  addAchievement,
  getMyAchievements,
  deleteAchievement,
  getAllAchievements
} = require('../controllers/achievementController');

const { protect } = require('../middleware/authMiddleware');
const { isAlumni } = require('../middleware/roleMiddleware');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// Alumni only routes
router.get(
  "/allAchievements",
  protect,
  getAllAchievements
);
router.get('/me', protect, isAlumni, getMyAchievements);
router.post('/', protect, isAlumni, upload.single('image'), addAchievement); 
router.delete('/:achvId', protect, isAlumni, deleteAchievement);


module.exports = router;