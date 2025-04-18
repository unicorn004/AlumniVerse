const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');
const eventRoutes = require('./routes/eventRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const linkedinRoutes = require('./routes/linkedinRoutes');

const app = express();

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

app.get('/', (req, res) => {
  res.send('🎓 Alumni Connect API is running...');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  }).catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });