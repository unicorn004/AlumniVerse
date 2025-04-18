const User = require('../models/User');

// example: GET /users?branch=IT&year=2020&location=Delhi
exports.getAllUsers = async (req, res) => {
    try {
      const filters = {};
  
      // Apply filters based on query parameters
      if (req.query.role) filters.role = req.query.role;
      if (req.query.branch) filters.branch = req.query.branch;
      if (req.query.graduationYear) filters.graduationYear = req.query.graduationYear; 
      if (req.query.location) filters.location = req.query.location;
  
      // pagination
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 10; // Default limit to 10 users per page
      const skip = (page - 1) * limit; // pagination logic
  
      // Fetch users based on the filters and pagination
      const users = await User.find(filters)
                              .skip(skip)
                              .limit(limit)
                              .select('-passwordHash');
      
      res.json(users);
    } catch (err) {
      console.error(err); 
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
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Role-based access control
    if (req.user.id !== id) {
      if (req.user.role === 'student' && user.role === 'student') {
      } else if (req.user.role === 'alumni' && user.role === 'alumni') {
      } else if (req.user.role === 'admin') {
      } else {
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