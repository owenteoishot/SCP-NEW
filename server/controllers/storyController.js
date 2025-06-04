const storyModel = require('../models/storyModel');

// Get all books + lock status for user
const getAllBooks = async (req, res) => {
  try {
    const books = await storyModel.getAllBooks(req.user.userId);
    res.json({ books });
  } catch {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

const unlockBook = async (req, res) => {
  const userId = req.user.userId;
  const { bookId, password } = req.body;

  if (!bookId || !password) {
    return res.status(400).json({ error: 'Book ID and password required' });
  }

  try {
    const book = await storyModel.getBookById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if (book.password !== password) {
      return res.status(403).json({ error: 'Incorrect password' });
    }

    await storyModel.unlockBook(userId, bookId);
    res.json({ message: 'Book unlocked' });
  } catch {
    res.status(500).json({ error: 'Failed to unlock book' });
  }
};

const getChapters = async (req, res) => {
  const userId = req.user.userId;
  const { bookId } = req.params;

  try {
    const unlocked = await storyModel.isBookUnlocked(userId, bookId);
    if (!unlocked) return res.status(403).json({ error: 'Book is locked' });

    const chapters = await storyModel.getChapters(bookId);
    res.json({ chapters });
  } catch {
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
};

module.exports = { getAllBooks, unlockBook, getChapters };
