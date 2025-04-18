const express = require('express');
const {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost
} = require('../controllers/postController');

const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getAllPosts);
router.post('/', protect, createPost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentOnPost);

module.exports = router;