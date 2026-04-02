const mongoose = require('mongoose');
const SkillSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  category: { type: String, trim: true, default: 'General' },
  level:    { type: Number, default: 80, min: 0, max: 100 },
  hoverCount: { type: Number, default: 0 },
  order:    { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Skill', SkillSchema);
