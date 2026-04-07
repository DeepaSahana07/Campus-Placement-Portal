const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role_offered: { type: String, required: true },
  ctc: { type: Number, required: true },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  logo_url: { type: String, default: '' },
  eligibility_cgpa: { type: Number, default: 0 },
  eligibility_max_backlogs: { type: Number, default: 0 },
  eligibility_departments: [String],
  deadline: { type: Date, default: null },
  status: { type: String, enum: ['active', 'upcoming', 'closed'], default: 'active' },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
