/**
 * Portfolio Seed Script
 * Run from backend folder: node seed.js
 * Connects directly to MongoDB Atlas and populates all collections.
 * Automatically embeds certificate images from S:\certificates\
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ MONGO_URI not found in .env'); process.exit(1); }

const Profile     = require('./models/Profile');
const Project     = require('./models/Project');
const Skill       = require('./models/Skill');
const Certificate = require('./models/Certificate');
const Experience  = require('./models/Experience');

/* ── Helper: read image file as base64 data-URL ──────────────────────── */
const toBase64 = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return null;
    const buf  = fs.readFileSync(filePath);
    const ext  = path.extname(filePath).toLowerCase();
    const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch { return null; }
};

const CERT_DIR = 'S:\\certificates';
const img = (name) => toBase64(path.join(CERT_DIR, name));

/* ── Profile ─────────────────────────────────────────────────────────── */
const PROFILE = {
  name:         'Shahzaib Nasir',
  title:        'Full Stack Developer',
  subtitle:     'MERN · Python · Machine Learning',
  bio:          "I'm a passionate full-stack developer who loves building clean, performant web applications. With expertise in the MERN stack and a strong interest in machine learning, I bring both frontend elegance and backend robustness to every project. I enjoy turning complex problems into simple, beautiful, and intuitive solutions.",
  location:     'Pakistan',
  email:        'shahzaibnasir3011@gmail.com',
  github:       'https://github.com/shahzaibcode11',
  linkedin:     '',
  whatsapp:     '',
  instagram:    '',
  heroTagline:  'Available for Work',
  ctaText:      'About Me',
  featuredSkills: 'React, Node.js, Express.js, MongoDB, Python, JavaScript, TypeScript, HTML/CSS, Bootstrap, SQL, Docker, Git, Machine Learning, REST APIs',
  seoTitle:     'Shahzaib Nasir — Full Stack Developer',
  seoDescription: 'Full stack developer specializing in MERN stack, Python, and Machine Learning.',
};

/* ── Skills ──────────────────────────────────────────────────────────── */
const SKILLS = [
  { name: 'React',           category: 'Frontend',  level: 88 },
  { name: 'JavaScript',      category: 'Frontend',  level: 90 },
  { name: 'TypeScript',      category: 'Frontend',  level: 72 },
  { name: 'HTML / CSS',      category: 'Frontend',  level: 92 },
  { name: 'Bootstrap',       category: 'Frontend',  level: 85 },
  { name: 'Node.js',         category: 'Backend',   level: 85 },
  { name: 'Express.js',      category: 'Backend',   level: 85 },
  { name: 'PHP',             category: 'Backend',   level: 70 },
  { name: 'REST APIs',       category: 'Backend',   level: 88 },
  { name: 'MongoDB',         category: 'Database',  level: 82 },
  { name: 'SQL / MySQL',     category: 'Database',  level: 78 },
  { name: 'Python',          category: 'AI / ML',   level: 82 },
  { name: 'Machine Learning',category: 'AI / ML',   level: 72 },
  { name: 'NLP',             category: 'AI / ML',   level: 65 },
  { name: 'Docker',          category: 'DevOps',    level: 68 },
  { name: 'Git / GitHub',    category: 'DevOps',    level: 88 },
];

/* ── Projects ────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    title:       'Blog App',
    description: 'A full-featured blog application built with JavaScript. Supports creating, editing, and deleting posts with a clean, responsive UI. Implements CRUD operations with a RESTful backend and persistent MongoDB storage.',
    techStack:   ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'HTML', 'CSS'],
    githubUrl:   'https://github.com/shahzaibcode11/Blogapp',
    liveUrl:     '',
    featured:    true,
    order:       0,
  },
  {
    title:       'Portfolio Website',
    description: 'Personal portfolio built with React and Material UI. Features light/dark mode, JWT-authenticated admin panel, MongoDB-backed data, RL-based project ranking, and lazy-loaded code-split routes for fast performance.',
    techStack:   ['React', 'Node.js', 'MongoDB', 'MUI', 'Framer Motion', 'Docker'],
    githubUrl:   'https://github.com/shahzaibcode11',
    liveUrl:     'https://shahzaibrj.netlify.app',
    featured:    false,
    order:       1,
  },
];

/* ── Certificates (with images from S:\certificates\) ───────────────── */
const CERTIFICATES = [
  {
    title:    'CSS, Bootstrap, JavaScript & PHP',
    issuer:   'Udemy',
    date:     '2023',
    imageUrl: img('css_BS_JS_php.jpg'),
    order:    1,
  },
  {
    title:    'JavaScript Fundamentals',
    issuer:   'Udemy',
    date:     '2023',
    imageUrl: img('Js.jpg'),
    order:    2,
  },
  {
    title:    'SQL & Database Management',
    issuer:   'Udemy',
    date:     '2023',
    imageUrl: img('SQL.jpg'),
    order:    3,
  },
  {
    title:    'Machine Learning',
    issuer:   'Udemy',
    date:     '2023',
    imageUrl: img('ML.jpg'),
    order:    4,
  },
  {
    title:    'Machine Learning & NLP',
    issuer:   'Udemy',
    date:     '2024',
    imageUrl: img('MLandNLP.jpg'),
    order:    5,
  },
  {
    title:    'Docker & Containers',
    issuer:   'Udemy',
    date:     '2024',
    imageUrl: img('Docker.jpg'),
    order:    6,
  },
  {
    title:    'GitHub Fundamentals',
    issuer:   'Udemy',
    date:     '2023',
    imageUrl: img('Git.jpg'),
    order:    7,
  },
  {
    title:    'Introduction to Artificial Intelligence',
    issuer:   'Coursera',
    date:     '2024',
    imageUrl: null,
    order:    8,
  },
  {
    title:    'Crash Course on Python',
    issuer:   'Coursera / Google',
    date:     '2024',
    imageUrl: null,
    order:    9,
  },
  {
    title:    'English Language Proficiency',
    issuer:   'British Council',
    date:     '2023',
    imageUrl: (() => {
      try {
        const buf = fs.readFileSync(path.join(CERT_DIR, 'English.jpeg'));
        return `data:image/jpeg;base64,${buf.toString('base64')}`;
      } catch { return null; }
    })(),
    order: 10,
  },
];

/* ── Experience ─────────────────────────────────────────────────────── */
const EXPERIENCES = [
  {
    company:     'Freelance',
    role:        'Full Stack Developer',
    startDate:   'Jan 2023',
    endDate:     '',
    current:     true,
    description: 'Building full-stack web applications for clients using the MERN stack. Delivering responsive, performant web apps with clean UI and robust REST APIs. Also applying ML models for data analysis tasks.',
    techStack:   ['React', 'Node.js', 'Express.js', 'MongoDB', 'Python', 'Docker'],
    order:       0,
  },
];

/* ── Runner ──────────────────────────────────────────────────────────── */
async function seed() {
  console.log('\n🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ Connected\n');

  await Profile.deleteMany({});
  await Profile.create(PROFILE);
  console.log('✅ Profile seeded');

  await Skill.deleteMany({});
  await Skill.insertMany(SKILLS.map((s, i) => ({ ...s, order: i })));
  console.log(`✅ ${SKILLS.length} skills seeded`);

  await Project.deleteMany({});
  await Project.insertMany(PROJECTS);
  console.log(`✅ ${PROJECTS.length} projects seeded`);

  const certsWithImages = CERTIFICATES.filter(c => c.imageUrl).length;
  await Certificate.deleteMany({});
  await Certificate.insertMany(CERTIFICATES);
  console.log(`✅ ${CERTIFICATES.length} certificates seeded (${certsWithImages} with images)`);

  await Experience.deleteMany({});
  await Experience.insertMany(EXPERIENCES);
  console.log(`✅ ${EXPERIENCES.length} experience entries seeded`);

  console.log('\n🎉 All data seeded successfully!');
  console.log('📝 Next steps:');
  console.log('   1. Run: node reset-admin.js  →  get admin login (password: Admin@1234)');
  console.log('   2. Login at /admin/login to add profile photo and extra projects\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('💥 Seed failed:', err.message);
  process.exit(1);
});
