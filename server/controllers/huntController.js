const pool = require('../db');

// Start a new hunt session (if one doesn't exist)
const startHunt = async (req, res) => {
  const userId = req.user.userId;
  try {
    const check = await pool.query('SELECT * FROM hunts WHERE user_id = $1 AND completed = false', [userId]);

    if (check.rows.length > 0) {
      return res.status(200).json({ message: 'Hunt already in progress', hunt: check.rows[0] });
    }

    const result = await pool.query(
      'INSERT INTO hunts (user_id, current_step, completed) VALUES ($1, $2, false) RETURNING *',
      [userId, 1]
    );

    res.status(201).json({ message: 'New hunt started', hunt: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Could not start hunt' });
  }
};

// Get current hunt status
const getHuntStatus = async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      'SELECT * FROM hunts WHERE user_id = $1 AND completed = false ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No active hunt' });
    }

    res.json({ hunt: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching hunt status' });
  }
};

// Mark a location as completed
const completeLocation = async (req, res) => {
  const userId = req.user.userId;
  const { stepCompleted } = req.body;

  try {
    const hunt = await pool.query(
      'SELECT * FROM hunts WHERE user_id = $1 AND completed = false ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (hunt.rows.length === 0) {
      return res.status(404).json({ error: 'No active hunt' });
    }

    const currentStep = hunt.rows[0].current_step;

    if (stepCompleted !== currentStep) {
      return res.status(400).json({ error: 'Step mismatch' });
    }

    const newStep = currentStep + 1;

    if (newStep > 5) { // let's say 5 is final
      await pool.query('UPDATE hunts SET completed = true WHERE id = $1', [hunt.rows[0].id]);
      return res.json({ message: 'Hunt completed!' });
    } else {
      await pool.query('UPDATE hunts SET current_step = $1 WHERE id = $2', [newStep, hunt.rows[0].id]);
      return res.json({ message: `Moved to step ${newStep}` });
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not update hunt step' });
  }
};

// List all completed hunts
const getHuntHistory = async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      'SELECT * FROM hunts WHERE user_id = $1 AND completed = true ORDER BY created_at DESC',
      [userId]
    );
    res.json({ history: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hunt history' });
  }
};

module.exports = { startHunt, getHuntStatus, completeLocation, getHuntHistory };
