const Post = require('../models/Post');
const User = require('../models/User');
const { cloudinary } = require('../utils/cloudinary');

exports.createPost = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      console.log('File uploaded:', req.file);

      // Upload to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'alumniverse', 
        public_id: `${req.user.id}-post-${Date.now()}`,  
        resource_type: 'image', 
      });

      // Set the image URL from Cloudinary result
      imageUrl = cloudinaryResult.secure_url;
    }
    // If image is sent as base64 (via req.body.image)
    else if (req.body.image) {
      imageUrl = req.body.image;  // Base64 image URL
    }

    const newPost = await Post.create({
      author: req.user._id,
      ...req.body,
      image: imageUrl,  // Save the image URL in the post
    });

    res.status(201).json(newPost);  // Respond with the created post
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      console.log('File uploaded:', req.file);  
      imageUrl = req.file.url; 
    }
    else if (req.body.image) {
      imageUrl = req.body.image;  
    }

    const newPost = await Post.create({
      author: req.user._id,
      ...req.body,
      image: imageUrl,  
    });

    res.status(201).json(newPost);  
  } catch (err) {
    console.error('Error creating post:', err);  
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'fullName role profileImage jobTitle company')
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map(post => ({
      ...post.toObject(),
      author: {
        id: post.author._id.toString(),
        name: post.author.fullName,
        role: post.author.role,
        profileImage: post.author.profileImage,
        currentJob: post.author.jobTitle,
        company: post.author.company
      }
    }));

    res.json(formattedPosts);
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
      comment: req.body.comment,
      profileImage: req.user.profileImage,
      fullName: req.user.fullName
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error commenting', error: err.message });
  }
};