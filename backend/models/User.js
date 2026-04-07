const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  department: { type: String, default: '' },
  year: { type: Number, default: 1 },
  cgpa: { type: Number, default: 0 },
  backlogs: { type: Number, default: 0 },
  skills: [String],
  phone: { type: String, default: '' },
  resume_url: { type: String, default: '' },
  status: { type: String, enum: ['placed', 'unplaced', 'intern'], default: 'unplaced' },
  placed_company: { type: String, default: null },
  placed_ctc: { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
