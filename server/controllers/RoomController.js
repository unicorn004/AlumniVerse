const Room = require('../models/Room');

const createRoom = async (req, res) => {
  try {
    const user1 = req.user.id;
    const user2 = req.body.friend_id;

    if (!user2) {
      return res.status(400).json({ error: 'friend_id is required' });
    }

    // Lexicographical order for consistent room naming
    const sortedIds = [user1, user2].sort();
    const roomName = `${sortedIds[0]}_${sortedIds[1]}`;

    // Check if room already exists
    let room = await Room.findOne({ roomName });
    if (room) {
      return res.status(409).json({ message: 'Room already exists', room });
    }

    // Create a new room
    room = new Room({
      user1: sortedIds[0],
      user2: sortedIds[1],
      roomName,
      messages: []
    });

    await room.save();

    res.status(201).json({ message: 'Room created', room });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// const Room = require('../models/Room');

/**
 * Fetch all rooms that a user is part of (either as user1 or user2).
 * Assumes req.user.id contains the authenticated user ID.
 */
const getUserRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const rooms = await Room.find({
      $or: [{ user1: userId }, { user2: userId }]
    })
    .populate('user1', 'fullName email profileImage') // populate user details (optional)
    .populate('user2', 'fullName email profileImage') 
    .populate({
      path: 'messages',
      options: { sort: { timestamp: -1 }, limit: 1 }, // last message preview
    });

    res.status(200).json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { createRoom , getUserRooms};
