const express      = require('express');
const multer       = require('multer');
const Profile      = require('../models/Profile');
const { protect }  = require('../middleware/auth');
const router       = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

// GET /api/profile  (public)
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.json(null);
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/profile  (admin — JSON fields only)
router.put('/', protect, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    res.json(profile);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// POST /api/profile/upload-image  (admin — multipart)
router.post('/upload-image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const profile = await Profile.findOneAndUpdate({}, { profileImage: b64 }, { new: true, upsert: true });
    res.json({ profileImage: profile.profileImage });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
