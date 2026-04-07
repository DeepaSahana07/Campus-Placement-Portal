const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 3 },
  is_approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
