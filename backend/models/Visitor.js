const mongoose = require('mongoose');
const VisitorSchema = new mongoose.Schema({
  sessionId: { type: String },
  page:      { type: String },
  referrer:  { type: String },
  userAgent: { type: String },
  duration:  { type: Number },
  events:    [{ type: { type: String }, target: String, timestamp: Date }],
}, { timestamps: true });
module.exports = mongoose.model('Visitor', VisitorSchema);
