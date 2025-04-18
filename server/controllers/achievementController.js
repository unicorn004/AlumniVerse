const User = require('../models/User');
const { cloudinary } = require('../utils/cloudinary');

exports.addAchievement = async (req, res) => {
  try {
    const { title, type, year, description } = req.body;
    let imageUrl = null;

    // Check if an image file is uploaded
    if (req.file) {
      console.log('File uploaded:', req.file);

      // Upload to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'alumniverse/achievements',  // Cloudinary folder for achievements' images
        public_id: `${req.user.id}-achievement-${Date.now()}`,  // Unique public_id
        resource_type: 'image',  // Treat file as an image
      });

      // Set the image URL from Cloudinary result
      imageUrl = cloudinaryResult.secure_url;
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Add the achievement to the user's achievements
    user.achievements.push({
      title,
      type,
      year,
      description,
      image: imageUrl,  // Store the Cloudinary URL (or base64 image if needed)
    });

    await user.save();

    res.status(200).json({ message: 'Achievement added', achievements: user.achievements });
  } catch (err) {
    console.error('Error adding achievement:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('achievements');
    res.status(200).json(user.achievements);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.achievements = user.achievements.filter(
      (achv) => achv._id.toString() !== req.params.achvId
    );
    await user.save();

    res.status(200).json({ message: 'Achievement removed', achievements: user.achievements });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllAchievements = async (req, res) => {
  try {
    console.log("hello there");
    const users = await User.find({}, {
      fullName: 1,
      jobTitle: 1,
      company: 1,
      graduationYear: 1,
      achievements: 1
    });

    const allAchievements = [];

    users.forEach(user => {
      user.achievements.forEach(achievement => {
        allAchievements.push({
          ...achievement.toObject(), // Convert Mongoose subdocument to plain object
          userName: user.fullName,
          jobTitle: user.jobTitle,
          company: user.company,
          graduationYear: user.graduationYear
        });
      });
    });

    res.status(200).json(allAchievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching achievements"
    });
  }
};