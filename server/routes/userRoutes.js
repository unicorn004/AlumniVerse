const express = require('express');
const {
  getAllUsers,
  getMyProfile,
  getUserById,
  updateUserProfile
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

//  Authenticated routes
router.get('/', protect, getAllUsers);            // Search + directory
router.get('/me', protect, getMyProfile);         // Logged-in user's profile
router.get('/:id', protect, getUserById);         // Any user's public profile
router.put('/:id', protect, updateUserProfile); 

module.exports = router;