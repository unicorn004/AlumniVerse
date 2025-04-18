const User = require('../models/User');

exports.addAchievement = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const user = await User.findById(req.user.id);
    user.achievements.push({ title, description, date });
    await user.save();
    res.status(200).json({ message: 'Achievement added', achievements: user.achievements });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('achievements');
    res.status(200).json(user.achievements);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
  }
};