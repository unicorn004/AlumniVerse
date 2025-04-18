const User = require('../models/User');
const { cloudinary, uploadToCloudinary } = require('../utils/cloudinary');
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
    const { id } = req.params;
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) return res.status(404).json({ message: 'User not found' });

    const currentUser = req.user;
    const isSelf = currentUser.id === id;
    const sameRole = currentUser.role === userToUpdate.role;

    if (!isSelf && currentUser.role !== 'admin' && !sameRole) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-passwordHash');
    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload the image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'alumniverse',  // Cloudinary folder
      public_id: `${req.user.id}-profile`,  // Using user ID for a unique file name
      resource_type: 'image',  // Ensures it's treated as an image
    });

    // Find the user and save the Cloudinary image URL
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profileImage = cloudinaryResult.secure_url;  // Save Cloudinary image URL

    await user.save();

    res.json({
      message: 'Profile image uploaded successfully',
      url: cloudinaryResult.secure_url  // Respond with the image URL
    });

  } catch (err) {
    console.error('Error uploading profile image:', err);
    res.status(500).json({
      message: 'Image upload failed',
      error: err.message
    });
  }
};

// PUT /users/upload/resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resume = req.file.url;
    await user.save();

    res.json({
      message: 'Resume uploaded successfully',
      url: req.file.url
    });

  } catch (err) {
    console.error('Error uploading resume:', err);
    res.status(500).json({
      message: 'Resume upload failed',
      error: err.message
    });
  }
};

exports.updateAllUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const {
      fullName,
      role,
      graduationYear,
      branch,
      jobTitle,
      company,
      location,
      bio,
      profileImage,
      linkedIn,
      resume,
      experiences,
      education,
      skills,
      achievements,
    } = req.body;

    const updatedData = {
      fullName,
      role,
      graduationYear,
      branch,
      jobTitle,
      company,
      location,
      bio,
      profileImage,
      linkedIn,
      resume,
      experiences,
      education,
      skills,
      achievements,
      isProfileComplete: true,
      updatedAt: new Date(),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile",
    });
  }
};