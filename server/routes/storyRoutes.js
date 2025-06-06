const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

router.get('/', storyController.getStories);
router.get('/:id', storyController.getStory);
router.get('/:id/chapters', storyController.getChapters);
router.get('/:id/chapters/:chapterNumber', storyController.getChapter);

module.exports = router;