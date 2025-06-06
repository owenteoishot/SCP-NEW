const jwt = require('jsonwebtoken');
const db = require('../models/db');

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await db.query('SELECT is_active FROM sessions WHERE token = $1', [token]);
    if (!session.rows[0]?.is_active) return res.sendStatus(403);

    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.sendStatus(403);
    }
    next();
  };
};

exports.requireAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }
  res.sendStatus(403);
};
