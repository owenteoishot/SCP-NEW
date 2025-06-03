const pool = require('../db');

// Get all books with lock status for a user
exports.getAllBooks = async (userId) => {
  const result = await pool.query(`
    SELECT b.id, b.title, b.description,
      CASE WHEN ub.book_id IS NOT NULL THEN true ELSE false END AS unlocked
    FROM story_books b
    LEFT JOIN user_unlocked_books ub
      ON b.id = ub.book_id AND ub.user_id = $1
    ORDER BY b.id;
  `, [userId]);

  return result.rows;
};

// Get a book by ID
exports.getBookById = async (bookId) => {
  const result = await pool.query('SELECT * FROM story_books WHERE id = $1', [bookId]);
  return result.rows[0];
};

// Mark a book as unlocked
exports.unlockBook = async (userId, bookId) => {
  return pool.query(`
    INSERT INTO user_unlocked_books (user_id, book_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [userId, bookId]);
};

// Check if book is unlocked
exports.isBookUnlocked = async (userId, bookId) => {
  const result = await pool.query(
    'SELECT * FROM user_unlocked_books WHERE user_id = $1 AND book_id = $2',
    [userId, bookId]
  );
  return result.rows.length > 0;
};

// Get all chapters of a book
exports.getChapters = async (bookId) => {
  const result = await pool.query(
    'SELECT chapter_number, title, content FROM story_chapters WHERE book_id = $1 ORDER BY chapter_number',
    [bookId]
  );
  return result.rows;
};
