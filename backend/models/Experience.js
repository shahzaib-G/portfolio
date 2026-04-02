const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company:     { type: String, required: true, trim: true },
  role:        { type: String, required: true, trim: true },
  startDate:   { type: String, trim: true },
  endDate:     { type: String, trim: true },
  current:     { type: Boolean, default: false },
  description: { type: String, trim: true },
  techStack:   [{ type: String }],
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
