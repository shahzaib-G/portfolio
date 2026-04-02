const express  = require('express');
const multer   = require('multer');
const Project  = require('../models/Project');
const { protect } = require('../middleware/auth');
const router   = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, f, cb) => f.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Images only')),
});

// GET /api/projects  (public) — RL-sorted
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ 'engagement.engagementScore': -1, order: 1 });
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/projects  (admin)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    if (typeof data.techStack === 'string') {
      data.techStack = data.techStack.split(',').map(s => s.trim()).filter(Boolean);
    }
    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/projects/:id  (admin)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    if (typeof data.techStack === 'string') {
      data.techStack = data.techStack.split(',').map(s => s.trim()).filter(Boolean);
    }
    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/projects/:id  (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/projects/:id/track  (public) — logs engagement + triggers RL
router.post('/:id/track', async (req, res) => {
  const { eventType, duration } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });

    const e = project.engagement;
    if (eventType === 'view')         e.views        += 1;
    if (eventType === 'click')        e.clicks       += 1;
    if (eventType === 'github_click') e.githubClicks += 1;
    if (eventType === 'live_click')   e.liveClicks   += 1;
    if (eventType === 'time' && duration) e.timeSpent += Number(duration);
    e.lastUpdated = new Date();

    await project.save();

    // Run RL re-ranking after every engagement event (async, non-blocking)
    Project.runRL().catch(err => console.error('[RL] Error:', err));

    res.json({ engagementScore: project.engagement.engagementScore });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
