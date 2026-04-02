const express   = require('express');
const Contact   = require('../models/Contact');
const { protect } = require('../middleware/auth');
const router    = express.Router();

router.post('/', async (req, res) => {
  try {
    const msg = await Contact.create(req.body);
    res.status(201).json({ message: 'Message sent', id: msg._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/', protect, async (req, res) => {
  try { res.json(await Contact.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/read', protect, async (req, res) => {
  try {
    const doc = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Contact.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
