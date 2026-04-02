const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const Admin     = require('./models/Admin');
require('./models/RlMeta'); // register model

// ── Load env ────────────────────────────────────────────────────────────────
dotenv.config();

// ── Validate required env ───────────────────────────────────────────────────
const requiredEnv = ['MONGO_URI'];
const missingEnv = requiredEnv.filter(v => !process.env[v]);

if (missingEnv.length > 0) {
  console.error(`❌ Missing required ENV variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = express();

// ── Security: Trust proxy (important for Render) ────────────────────────────
app.set('trust proxy', 1);

// ── Rate limiting ──────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
}));

// ── CORS ───────────────────────────────────────────────────────────────────
const allowed = [
  'https://shahzaibrj.netlify.app',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    console.warn(`⚠️ Blocked by CORS: ${origin}`);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/profile',      require('./routes/profile'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/experiences',  require('./routes/experiences'));
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/skills',       require('./routes/skills'));
app.use('/api/contact',      require('./routes/contact'));
app.use('/api/analytics',    require('./routes/analytics'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ── Seed Admin (safe) ───────────────────────────────────────────────────────
const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const pass  = process.env.ADMIN_PASSWORD;

    if (!email || !pass) {
      console.warn('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set');
      return;
    }

    const exists = await Admin.findOne({ email: email.toLowerCase() });

    if (!exists) {
      await Admin.create({ email, password: pass, name: 'Admin' });
      console.log(`✅ Admin created → ${email}`);
    } else {
      console.log('ℹ️ Admin already exists');
    }
  } catch (err) {
    console.error('❌ Admin seed failed:', err.message);
  }
};

// ── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

// ── Handle unhandled errors (VERY IMPORTANT) ────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  process.exit(1);
});

// ── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    console.log('🌱 Seeding admin...');
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('💥 Server failed to start:', err.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;