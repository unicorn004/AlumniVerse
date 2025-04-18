const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },

  userType: {
    type: String,
    enum: ['alumni', 'student', 'admin'],
    default: 'student',
    required: true
  },

  graduationYear: Number,
  branch: String,
  jobTitle: String,
  company: String,
  location: String,

  bio: String,
  profileImage: String,
  linkedIn: String,
  achievements: [String], 

  isVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);