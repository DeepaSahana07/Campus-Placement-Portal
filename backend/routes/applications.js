const router = require('express').Router();
const Application = require('../models/Application');
const User = require('../models/User');
const Company = require('../models/Company');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/my', auth, async (req, res) => {
  try {
    const apps = await Application.find({ student_id: req.user.id }).populate('company_id').sort({ applied_at: -1 });
    res.json(apps);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { company_id } = req.body;
    const existing = await Application.findOne({ student_id: req.user.id, company_id });
    if (existing) return res.status(400).json({ message: 'Already applied' });
    const app = await Application.create({ student_id: req.user.id, company_id });
    res.status(201).json(app);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('student_id', 'name email department cgpa')
      .populate('company_id', 'name role_offered ctc')
      .sort({ applied_at: -1 });
    res.json(apps);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('company_id', 'name ctc');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    
    if (status === 'selected') {
      await User.findByIdAndUpdate(app.student_id, {
        is_placed: true,
        placed_company: app.company_id.name,
        placed_ctc: app.company_id.ctc,
      });
    }
    res.json(app);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
