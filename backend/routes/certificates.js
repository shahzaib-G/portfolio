// routes/certificates.js
const express = require('express');
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Certificate.find().sort({ order: 1, createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Certificate.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});
router.put('/:id', protect, async (req, res) => {
  try {
    const doc = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/:id', protect, async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
