const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// ✅ Full CORS Setup
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(helmet());

app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Try again later.' },
});
app.use('/api/auth/login', authLimiter);

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hunt', require('./routes/huntRoutes'));
app.use('/api/story', require('./routes/storyRoutes'));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
