const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  jobTitle: String,
  company: String,
  description: String,
  startMonth: String,
  startYear: String,
  endMonth: String,
  endYear: String,
  current: { type: Boolean, default: false }
}, { _id: false });

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  startMonth: String,
  startYear: String,
  endMonth: String,
  endYear: String,
  current: { type: Boolean, default: false }
}, { _id: false });

const achievementSchema = new mongoose.Schema({
  title: String,
  type: String,
  year: String,
  description: String,
  image: String // image URL or base64 or Cloudinary ref
}, { _id: true });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },

  role: {
    type: String,
    enum: ["alumni", "student", "admin"],
    default: "student",
    required: true,
  },

  graduationYear: Number,
  branch: String,
  jobTitle: String,
  company: String,
  location: String,

  bio: String,
  profileImage: String,
  linkedIn: String,
  resume: String, // file URL or Cloudinary URL

  experiences: [experienceSchema],
  education: [educationSchema],
  skills: [String],
  achievements: [achievementSchema],

  isVerified: { type: Boolean, default: false },
  isProfileComplete: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);