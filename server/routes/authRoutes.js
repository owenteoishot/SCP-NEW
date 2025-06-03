const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, (req, res) => res.json({ userId: req.user.userId }));



router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });

    const newAccessToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ token: newAccessToken });
  });
});


module.exports = router;