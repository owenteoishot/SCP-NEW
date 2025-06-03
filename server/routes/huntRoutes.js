const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { startHunt, getHuntStatus, completeLocation, getHuntHistory } = require('../controllers/huntController.js');

// All routes require auth
router.use(authenticateToken);

router.post('/start', startHunt);
router.get('/status', getHuntStatus);
router.post('/complete-location', completeLocation);
router.get('/history', getHuntHistory);

module.exports = router;
