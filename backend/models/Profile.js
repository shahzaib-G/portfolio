const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name:         { type: String, default: '' },
  title:        { type: String, default: '' },
  subtitle:     { type: String, default: '' },
  bio:          { type: String, default: '' },
  location:     { type: String, default: '' },
  email:        { type: String, default: '' },
  profileImage: { type: String, default: '' }, // base64 or URL

  github:    { type: String, default: '' },
  linkedin:  { type: String, default: '' },
  whatsapp:  { type: String, default: '' },
  instagram: { type: String, default: '' },
  twitter:   { type: String, default: '' },
  website:   { type: String, default: '' },

  heroTagline:    { type: String, default: '' },
  ctaText:        { type: String, default: 'Get In Touch' },
  resumeUrl:      { type: String, default: '' },
  featuredSkills: { type: String, default: '' },

  seoTitle:       { type: String, default: '' },
  seoDescription: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
