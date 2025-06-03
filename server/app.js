const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const huntRoutes = require('./routes/huntRoutes');
const storyRoutes = require('./routes/storyRoutes');


const rateLimit = require('express-rate-limit');
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/hunt', huntRoutes);
app.use('/api/story', storyRoutes);


// Optional: 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Try again later.' }
});

module.exports = app;
