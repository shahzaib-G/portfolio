const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');

// @route   GET /api/experiences
// @desc    Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
