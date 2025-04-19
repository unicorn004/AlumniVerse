const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { Server } = require("socket.io");
const http = require('http');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');
const eventRoutes = require('./routes/eventRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const linkedinRoutes = require('./routes/linkedinRoutes');


// const groupRoutes = require("./routes/groupRoutes.js");
const { router: chatRoutes, handleSocketConnections } = require("./routes/chat.js");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  logger: 'debug'
});

// Initialize socket.io
handleSocketConnections(io);
app.set("socketio", io);


// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/linkedin', linkedinRoutes);
// app.use("/api/group", groupRoutes);
app.use("/api/chat", chatRoutes);

app.get('/', (req, res) => {
  res.send('🎓 Alumni Connect API is running...');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // console.log('Connected to MongoDB');
    server.listen(process.env.PORT || 5000, () =>
      // console.log(`Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  }).catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });