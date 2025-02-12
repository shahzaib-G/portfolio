const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');

// @route   GET /api/certificates
// @desc    Get all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ date: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
