const db = require('../models/db');

exports.flagContent = async (req, res) => {
  try {
    const { content_type, content_id } = req.body;
    const reported_by = req.user.userId;

    if (!content_type || !content_id) {
      return res.status(400).json({ message: 'Missing flag data' });
    }

    if (!['post', 'comment', 'profile', 'media'].includes(content_type)) {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    const result = await db.query(
      `INSERT INTO content_flags (content_type, content_id, reported_by)
       VALUES ($1, $2, $3) RETURNING *`,
      [content_type, content_id, reported_by]
    );

    res.status(201).json({ message: 'Flag recorded', data: result.rows[0] });
  } catch (err) {
    console.error('Error recording flag:', err);
    res.status(500).json({ message: 'Error recording flag' });
  }
};
