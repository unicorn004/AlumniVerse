const express = require('express');
const {
  getAllUsers,
  getMyProfile,
  getUserById,
  updateUserProfile,
  uploadProfileImage,
  uploadResume,
  updateAllUserProfile,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// Authenticated routes
router.get('/', protect, getAllUsers);             // Search + directory
router.get('/me', protect, getMyProfile);          // Logged-in user's profile
router.put('/', protect, updateUserProfile);    
router.put('/all', protect, updateAllUserProfile);  
router.get('/:id', protect, getUserById);          // Any user's public profile

router.put('/upload/profile-image', protect, upload.single('profileImage'), uploadProfileImage);
router.put('/upload/resume', protect, upload.single('resume'), uploadResume);

module.exports = router;