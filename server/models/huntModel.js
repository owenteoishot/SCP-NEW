const pool = require('../db');

exports.getActiveHunt = (userId) => {
  return pool.query('SELECT * FROM hunts WHERE user_id = $1 AND completed = false ORDER BY created_at DESC LIMIT 1', [userId]);
};

exports.createNewHunt = (userId) => {
  return pool.query('INSERT INTO hunts (user_id, current_step, completed) VALUES ($1, $2, false) RETURNING *', [userId, 1]);
};

exports.updateStep = (huntId, newStep) => {
  return pool.query('UPDATE hunts SET current_step = $1 WHERE id = $2', [newStep, huntId]);
};

exports.completeHunt = (huntId) => {
  return pool.query('UPDATE hunts SET completed = true WHERE id = $1', [huntId]);
};

exports.getHuntHistory = (userId) => {
  return pool.query('SELECT * FROM hunts WHERE user_id = $1 AND completed = true ORDER BY created_at DESC', [userId]);
};
