const User = require('../models/User');

// GET /users?branch=IT&graduationYear=2020&location=Delhi&page=1&limit=10
exports.getAllUsers = async (req, res) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.branch) filters.branch = req.query.branch;
    if (req.query.graduationYear) filters.graduationYear = req.query.graduationYear;
    if (req.query.location) filters.location = req.query.location;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find(filters)
      .skip(skip)
      .limit(limit)
      .select('-passwordHash');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// GET /users/me
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
};

// PUT /users/:id
exports.updateUserProfile = async (req, res) => {
  try {
    console.log("hello");
    console.log(req.user);
    
    const userId = req.user.id;
    console.log(userId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    ).select('-passwordHash'); // Exclude password hash from response

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};


// PUT /users/upload/profile-image
exports.uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.profileImage = req.file.path;
    await user.save();
    res.json({ message: 'Profile image uploaded', url: req.file.path });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
};

// PUT /users/upload/resume
exports.uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.resume = req.file.path;
    await user.save();
    res.json({ message: 'Resume uploaded', url: req.file.path });
  } catch (err) {
    res.status(500).json({ message: 'Resume upload failed', error: err.message });
  }
};