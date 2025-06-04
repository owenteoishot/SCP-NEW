const huntModel = require('../models/huntModel');

const startHunt = async (req, res) => {
  const userId = req.user.userId;
  try {
    const check = await huntModel.getActiveHunt(userId);

    if (check.rows.length > 0) {
      return res.status(200).json({ message: 'Hunt already in progress', hunt: check.rows[0] });
    }

    const result = await huntModel.createNewHunt(userId);
    res.status(201).json({ message: 'New hunt started', hunt: result.rows[0] });
  } catch {
    res.status(500).json({ error: 'Could not start hunt' });
  }
};

const getHuntStatus = async (req, res) => {
  try {
    const result = await huntModel.getActiveHunt(req.user.userId);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No active hunt' });
    }

    res.json({ hunt: result.rows[0] });
  } catch {
    res.status(500).json({ error: 'Error fetching hunt status' });
  }
};

const completeLocation = async (req, res) => {
  const userId = req.user.userId;
  const { stepCompleted } = req.body;

  try {
    const hunt = await huntModel.getActiveHunt(userId);
    if (hunt.rows.length === 0) return res.status(404).json({ error: 'No active hunt' });

    const current = hunt.rows[0];
    if (stepCompleted !== current.current_step) return res.status(400).json({ error: 'Step mismatch' });

    const newStep = current.current_step + 1;

    if (newStep > 5) {
      await huntModel.completeHunt(current.id);
      return res.json({ message: 'Hunt completed!' });
    } else {
      await huntModel.updateStep(current.id, newStep);
      return res.json({ message: `Moved to step ${newStep}` });
    }
  } catch {
    res.status(500).json({ error: 'Failed to update hunt step' });
  }
};

const getHuntHistory = async (req, res) => {
  try {
    const result = await huntModel.getHuntHistory(req.user.userId);
    res.json({ history: result.rows });
  } catch {
    res.status(500).json({ error: 'Failed to fetch hunt history' });
  }
};

module.exports = { startHunt, getHuntStatus, completeLocation, getHuntHistory };
