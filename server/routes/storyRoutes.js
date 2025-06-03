const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getAllBooks,
  unlockBook,
  getChapters
} = require('../controllers/storyController');

router.use(authenticateToken); // Protect all routes

router.get('/books', getAllBooks);
router.post('/unlock', unlockBook);
router.get('/:bookId/chapters', getChapters);

module.exports = router;
