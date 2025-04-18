const express = require('express');
const { getAllUsers, getUserById, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

router.get('/', protect, getAllUsers);             // Alumni directory + filter/search
router.get('/:id', protect, getUserById);          // Profile page
router.put('/:id', protect, updateUserProfile);    // Edit profile
router.get('/me', protect, async (req, res) => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  });

module.exports = router;