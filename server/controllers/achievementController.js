const User = require('../models/User');

exports.addAchievement = async (req, res) => {
  try {
    const { title, type, year, description } = req.body;
    const image = req.file?.path;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.achievements.push({ title, type, year, description, image });
    await user.save();

    res.status(200).json({ message: 'Achievement added', achievements: user.achievements });
  } catch (err) {
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