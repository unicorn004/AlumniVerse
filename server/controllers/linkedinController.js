exports.syncLinkedIn = async (req, res) => {
    try {
      const { linkedInUrl } = req.body;
      if (!linkedInUrl) return res.status(400).json({ message: 'LinkedIn URL required' });
  
      req.user.linkedIn = linkedInUrl;
      await req.user.save();
  
      res.status(200).json({ message: 'LinkedIn synced', profile: req.user });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };  