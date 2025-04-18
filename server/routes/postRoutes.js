const express = require('express');
const {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost
} = require('../controllers/postController');

const { protect } = require('../middleware/authMiddleware');
const { isAlumni } = require('../middleware/roleMiddleware');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

router.get('/', protect, getAllPosts);
router.post('/', protect, isAlumni, upload.single('image'), createPost); // Image upload via Cloudinary
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentOnPost);

module.exports = router;