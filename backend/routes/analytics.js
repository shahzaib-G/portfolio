const express = require('express');
const Visitor = require('../models/Visitor');
const { protect } = require('../middleware/auth');
const router  = express.Router();

router.post('/visit', async (req, res) => {
  try {
    await Visitor.create(req.body);
    res.status(201).json({ ok: true });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/summary', protect, async (req, res) => {
  try {
    const total     = await Visitor.countDocuments();
    const today     = new Date(); today.setHours(0, 0, 0, 0);
    const todayCount = await Visitor.countDocuments({ createdAt: { $gte: today } });
    const pages     = await Visitor.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort:  { count: -1 } }, { $limit: 10 },
    ]);
    const recentVisitors = await Visitor.find().sort({ createdAt: -1 }).limit(20);
    res.json({ total, todayCount, pages, recentVisitors });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
