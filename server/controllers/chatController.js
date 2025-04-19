const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Room = require('../models/Room');

/**
 * Adds a message to an existing room.
 * @param {String} userId - ID of the user sending the message
 * @param {String} messageText - The message content
 * @param {String} roomId - ID of the room to add message to
 * @returns {Object} - Newly created message or error object
 */
const createAndAddMessage = async (userId, messageText, roomId) => {
  try {
    if (!userId || !messageText || !roomId) {
      throw new Error('userId, messageText, and roomId are required');
    }

    // Validate room
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // Create message
    const newMessage = new Message({
      sender: userId,
      content: messageText,
      room: roomId,
    });

    await newMessage.save();

    // Add message to the room's message list
    room.messages.push(newMessage._id);
    await room.save();

    return newMessage;
  } catch (error) {
    console.error('Error in createAndAddMessage:', error);
    throw error;
  }
};


// Handle socket connections
const handleSocketConnections = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }
    // console.log("from socket" + token);
    
    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error("JWT auth failed:", err.message);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    // console.log(`New client connected: ${socket.user.id}`);

    // Join Room
    socket.on("joinRoom", async (roomId) => {
      socket.join(roomId);
      // console.log(`User ${socket.user.id} joined room ${roomId}`);

      try {
        const room = await Room.findById(roomId).populate({
          path: "messages",
          populate: { path: "sender", select: "name" }
        });

        if (room) {
          socket.emit("previousMessages", room.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    });

    // Handle incoming message
    socket.on("serverRcvsMsg", async (messageData) => {
      try {
        // console.log(`Message received in room ${messageData.roomId}:`, messageData);

        const room = await Room.findById(messageData.roomId);
        if (!room) {
          // console.log("Room not found");
          return;
        }

        // Create and save new message
        const newMessage = new Message({
          sender: messageData.userId, // or socket.user.id if you trust it
          content: messageData.text,
          room: messageData.roomId,
          timestamp: new Date(),
        });

        await newMessage.save();

        // Push message into room
        room.messages.push(newMessage._id);
        await room.save();

        // Fetch the last saved message populated
        const populatedRoom = await Room.findOne(
          { _id: messageData.roomId },
          { messages: { $slice: -1 } }
        ).populate({
          path: "messages",
          populate: { path: "sender", select: "name" }
        });

        if (!populatedRoom || populatedRoom.messages.length === 0) {
          // console.log("No messages found after saving.");
          return;
        }

        const populatedMessage = populatedRoom.messages[0];

        // console.log("Emitting message to room:", messageData.roomId, populatedMessage);
        io.to(messageData.roomId).emit("serverSendsMsg", populatedMessage);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    socket.on("disconnect", () => {
      // console.log("Client disconnected");
    });
  });
};



module.exports = {
  createAndAddMessage,
  handleSocketConnections
};
