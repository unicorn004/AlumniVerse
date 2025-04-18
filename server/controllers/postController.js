const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create({
      author: req.user._id,
      ...req.body,
      image: req.file?.path || null
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'fullName profileImage userType')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error liking post', error: err.message });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    console.log(req.params.id);
    
    const post = await Post.findById(req.params.id);
    if (!req.body.comment) return res.status(400).json({ message: 'Comment cannot be empty' });

    post.comments.push({
      user: req.user.id,
      comment: req.body.comment
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error commenting', error: err.message });
  }
};