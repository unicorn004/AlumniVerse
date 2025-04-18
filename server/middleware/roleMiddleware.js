const isAlumni = (req, res, next) => {
    if (req.user.role !== 'alumni') {
      return res.status(403).json({ message: 'Alumni only access' });
    }
    next();
  };
  
  const isStudent = (req, res, next) => {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Student only access' });
    }
    next();
  };
  
  module.exports = { isAlumni, isStudent };