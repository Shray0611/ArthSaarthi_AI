const mongoose = require('mongoose');

const verifiedLinkSchema = new mongoose.Schema({
    schemeName: { type: String, required: true, unique: true },
    verifiedUrl: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VerifiedLink', verifiedLinkSchema);
