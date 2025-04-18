const express = require('express');
const { getAllUsers, getUserById, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAllUsers);             // Alumni directory + filter/search
router.get('/:id', protect, getUserById);          // Profile page
router.put('/:id', protect, updateUserProfile);    // Edit profile

module.exports = router;