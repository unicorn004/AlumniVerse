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

//  GET /users/me - from token
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

//  GET /users/:id - view other user's profile (public)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
};

// ✅ PUT /users/:id - edit with ownership/role check
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) return res.status(404).json({ message: 'User not found' });

    const currentUser = req.user;
    const isSelf = currentUser.id === id;
    const sameRole = currentUser.role === userToUpdate.role;

    if (!isSelf) {
      if (currentUser.role === 'admin') {
        // Admin can edit anyone
      } else if (!sameRole) {
        return res.status(403).json({ message: 'Not authorized to update this profile' });
      }
    }

    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-passwordHash');
    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};