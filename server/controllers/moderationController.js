const moderationModel = require('../models/moderationModel');
const db = require('../models/db');

exports.logModeration = async (req, res) => {
  try {
    const modId = req.user.userId;
    const { targetUser, actionType, reason } = req.body;
    const logged = await moderationModel.logAction(targetUser, modId, actionType, reason);
    res.status(201).json({ message: 'Moderation action logged', data: logged });
  } catch (err) {
    console.error('Failed to log moderation action:', err);
    res.status(500).json({ message: 'Failed to log action' });
  }
};

exports.getFlaggedContent = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM content_flags WHERE status = 'pending' ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pending flags:', err);
    res.status(500).json({ message: 'Failed to fetch flagged content' });
  }
};

exports.resolveFlag = async (req, res) => {
  try {
    const moderatorId = req.user.userId;
    const { flagId, action } = req.body; // action = 'dismissed' or 'actioned'

    if (!['dismissed', 'actioned'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await db.query(
      `UPDATE content_flags
       SET status = $1, resolved_by = $2, resolved_at = NOW()
       WHERE flag_id = $3`,
      [action, moderatorId, flagId]
    );

    res.json({ message: `Flag ${action}` });
  } catch (err) {
    console.error('Error resolving flag:', err);
    res.status(500).json({ message: 'Failed to resolve flag' });
  }
};

exports.getPostFlags = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        f.flag_id,
        f.status,
        f.created_at,
        p.post_id,
        p.title,
        p.content,
        u.username AS author
      FROM content_flags f
      JOIN posts p ON f.content_id = p.post_id::TEXT
      JOIN users u ON p.author_id = u.user_id
      WHERE f.content_type = 'post'
      ORDER BY f.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching post flags:', err);
    res.status(500).json({ message: 'Failed to fetch post flags' });
  }
};
