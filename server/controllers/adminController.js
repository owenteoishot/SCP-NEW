const db = require('../models/db');

exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.user_id, u.username, u.email, r.role_name AS role
      FROM users u
      JOIN user_roles ur ON u.user_id = ur.user_id
      JOIN roles r ON ur.role_id = r.role_id
      WHERE r.role_name != 'admin'
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Admin fetch users failed:', err);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

exports.promoteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const roleRes = await db.query(`SELECT role_id FROM roles WHERE role_name = 'moderator' LIMIT 1`);
    const modRoleId = roleRes.rows[0]?.role_id;
    if (!modRoleId) return res.status(500).json({ message: 'Moderator role not found' });

    await db.query(`UPDATE user_roles SET role_id = $1 WHERE user_id = $2`, [modRoleId, userId]);
    res.json({ message: 'User promoted', user_id: userId, new_role: 'moderator' });
  } catch (err) {
    console.error('Promotion failed:', err);
    res.status(500).json({ message: 'Could not promote user' });
  }
};

exports.demoteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const roleRes = await db.query(`SELECT role_id FROM roles WHERE role_name = 'user' LIMIT 1`);
    const userRoleId = roleRes.rows[0]?.role_id;
    if (!userRoleId) return res.status(500).json({ message: 'User role not found' });

    await db.query(`UPDATE user_roles SET role_id = $1 WHERE user_id = $2`, [userRoleId, userId]);
    res.json({ message: 'User demoted', user_id: userId, new_role: 'user' });
  } catch (err) {
    console.error('Demotion failed:', err);
    res.status(500).json({ message: 'Could not demote user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await db.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete user failed:', err);
    res.status(500).json({ message: 'Could not delete user' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    await db.query(`DELETE FROM posts WHERE post_id = $1`, [postId]);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Post delete failed:', err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

// ✅ Newly added
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
    console.error('Fetch post flags failed:', err);
    res.status(500).json({ message: 'Could not fetch flags' });
  }
};
