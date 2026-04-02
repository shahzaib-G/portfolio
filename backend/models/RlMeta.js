const mongoose = require('mongoose');

const RlMetaSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('RlMeta', RlMetaSchema);
