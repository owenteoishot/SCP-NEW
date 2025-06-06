const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middleware/authMiddleware');

// Get all posts, or filter by userId
router.get('/', postController.getPosts);

// Authenticated users can create posts
router.post('/', authenticate, postController.createPost);

module.exports = router;
