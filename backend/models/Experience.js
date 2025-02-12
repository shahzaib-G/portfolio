const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Experience', ExperienceSchema);
