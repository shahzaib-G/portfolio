const express      = require('express');
const crypto       = require('crypto');
const jwt          = require('jsonwebtoken');
const nodemailer   = require('nodemailer');
const Admin        = require('../models/Admin');
const { protect }  = require('../middleware/auth');
const router       = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: signToken(admin._id), admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json({ admin: req.admin }));

// POST /api/auth/change-password
router.post('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!(await admin.matchPassword(currentPassword)))
      return res.status(401).json({ message: 'Current password incorrect' });
    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(404).json({ message: 'No account with that email' });

    const token   = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000; // 1 hour

    admin.resetPasswordToken   = token;
    admin.resetPasswordExpires = new Date(expires);
    await admin.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });

    await transporter.sendMail({
      from: `"Portfolio Admin" <${process.env.GMAIL_USER}>`,
      to: admin.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;background:#0a0f1e;color:#e0e6ff;border-radius:16px;">
          <h2 style="color:#7c5cff;margin-bottom:8px;">Password Reset</h2>
          <p>You requested a password reset for your portfolio admin account.</p>
          <p>Click the button below — link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:linear-gradient(135deg,#7c5cff,#00d4ff);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;">Reset Password</a>
          <p style="font-size:12px;color:#666;">If you didn't request this, ignore this email. Your password won't change.</p>
        </div>`,
    });

    res.json({ message: 'Reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const admin = await Admin.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!admin) return res.status(400).json({ message: 'Token invalid or expired' });

    admin.password             = req.body.password;
    admin.resetPasswordToken   = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
