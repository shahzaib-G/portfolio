const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const Admin     = require('./models/Admin');
require('./models/RlMeta');

dotenv.config();

const app = express();

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  // Don't validate x-forwarded-for on Render (they manage it)
  validate: { xForwardedForHeader: false },
}));

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowed = [
  'https://shahzaibrj.netlify.app',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
// 10 MB to support base64 image uploads stored in MongoDB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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

// Health check — Render pings this to keep the service alive
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ── Seed admin from env vars only (no hardcoded data) ─────────────────────────
const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const pass  = process.env.ADMIN_PASSWORD;
  if (!email || !pass) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set. Skipping seed.');
    return;
  }
  const exists = await Admin.findOne({ email: email.toLowerCase() });
  if (!exists) {
    await Admin.create({ email, password: pass, name: 'Admin' });
    console.log('✅ Admin created →', email);
  } else {
    console.log('ℹ️  Admin exists →', email);
  }
};

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ── Start server ──────────────────────────────────────────────────────────────
// Render injects PORT automatically — do NOT add PORT to your env vars in Render dashboard
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected');
    await seedAdmin();
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error('💥 Startup failed:', err.message);
    process.exit(1);
  }
})();

module.exports = app;
