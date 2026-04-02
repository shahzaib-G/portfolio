const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const Admin     = require('./models/Admin');
require('./models/RlMeta'); // register model

dotenv.config();

const app = express();

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, validate: { xForwardedForHeader: false } }));

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowed = [
  'https://shahzaibrj.netlify.app',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => (!origin || allowed.includes(origin)) ? cb(null, true) : cb(new Error('Not allowed by CORS')),
  credentials: true,
}));

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/profile',      require('./routes/profile'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/experiences',  require('./routes/experiences'));
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/skills',       require('./routes/skills'));
app.use('/api/contact',      require('./routes/contact'));
app.use('/api/analytics',    require('./routes/analytics'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── Seed admin (from env only, no hardcoded data) ─────────────────────────────
const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const pass  = process.env.ADMIN_PASSWORD;
  if (!email || !pass) { console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env'); return; }
  const exists = await Admin.findOne({ email: email.toLowerCase() });
  if (!exists) {
    await Admin.create({ email, password: pass, name: 'Admin' });
    console.log('✅ Admin account created →', email);
  } else {
    console.log('ℹ️  Admin already exists');
  }
};

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥', err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
  } catch (err) {
    console.error('💥 Server start failed:', err.message);
    process.exit(1);
  }
})();

module.exports = app;
