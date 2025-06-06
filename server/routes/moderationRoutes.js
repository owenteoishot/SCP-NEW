const express = require('express');
const router = express.Router();
const moderationController = require('../controllers/moderationController');
const { authenticate, authorize, requireAdmin } = require('../middleware/authMiddleware');

// Only admins can view all pending flags
router.get('/flags/pending', authenticate, requireAdmin, moderationController.getFlaggedContent);

// Admins and moderators can view flagged posts
router.get('/flags/posts', authenticate, authorize(['admin', 'moderator']), moderationController.getPostFlags);

// Admins can resolve a flag (e.g., dismiss or action it)
router.post('/action', authenticate, requireAdmin, moderationController.resolveFlag);

// Log moderation action (admin or moderator)
router.post('/log', authenticate, authorize(['admin', 'moderator']), moderationController.logModeration);

module.exports = router;
