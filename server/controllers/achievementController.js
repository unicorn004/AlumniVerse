const User = require('../models/User');

// Add new achievement (Alumni only)
exports.addAchievement = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.achievements.push({ title, description, date });
    await user.save();

    res.status(200).json({
      message: 'Achievement added',
      achievements: user.achievements
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get achievements of logged-in user (Alumni only)
exports.getMyAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('achievements');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.achievements);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a specific achievement (Alumni only)
exports.deleteAchievement = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const achievementExists = user.achievements.some(
      (achv) => achv._id.toString() === req.params.achvId
    );

    if (!achievementExists) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    user.achievements = user.achievements.filter(
      (achv) => achv._id.toString() !== req.params.achvId
    );

    await user.save();
    res.status(200).json({
      message: 'Achievement removed',
      achievements: user.achievements
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};