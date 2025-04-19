const express = require("express");

const {protect} = require("../middleware/authMiddleware.js");
const { createRoom, getUserRooms } = require("../controllers/RoomController.js");
const {handleSocketConnections} = require("../controllers/chatController.js")
const router = express.Router();

// Route to create a new chat room
router.post("/createRoom", protect, createRoom);

// Route to get all chat rooms
router.get("/getUserRooms", protect, getUserRooms);

module.exports = { router, handleSocketConnections };
