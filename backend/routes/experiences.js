const router = require('express').Router();
const Experience = require('../models/Experience');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const exps = await Experience.find()
      .populate('student_id', 'name')
      .populate('company_id', 'name')
      .sort({ createdAt: -1 });
    res.json(exps);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { company_id, title, content, rating } = req.body;
    const exp = await Experience.create({ student_id: req.user.id, company_id, title, content, rating });
    res.status(201).json(exp);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, { is_approved: true }, { new: true });
    res.json(exp);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
