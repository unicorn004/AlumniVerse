const User = require('../models/User');

// GET /users?branch=IT&year=2020&location=Delhi
exports.getAllUsers = async (req, res) => {
  try {
    const filters = {};
    if (req.query.branch) filters.branch = req.query.branch;
    if (req.query.graduationYear) filters.graduationYear = req.query.graduationYear;
    if (req.query.location) filters.location = req.query.location;
    if (req.query.userType) filters.userType = req.query.userType;

    const users = await User.find(filters).select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-passwordHash');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};