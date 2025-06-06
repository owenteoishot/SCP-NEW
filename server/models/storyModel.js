const db = require('./db');

exports.getAllStories = async () => {
  const result = await db.query('SELECT * FROM stories ORDER BY created_at DESC');
  return result.rows;
};

exports.getStoryById = async (id) => {
  const result = await db.query('SELECT * FROM stories WHERE id = $1', [id]);
  return result.rows[0];
};