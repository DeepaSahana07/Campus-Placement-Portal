const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status: { type: String, enum: ['pending', 'shortlisted', 'selected', 'rejected'], default: 'pending' },
  applied_at: { type: Date, default: Date.now },
}, { timestamps: true });

applicationSchema.index({ student_id: 1, company_id: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
