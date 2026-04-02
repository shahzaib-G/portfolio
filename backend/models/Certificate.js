const mongoose = require('mongoose');
const CertificateSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  issuer:      { type: String, required: true, trim: true },
  date:        { type: String, trim: true },
  credentialUrl: { type: String, trim: true },
  imageUrl:    { type: String, trim: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Certificate', CertificateSchema);
