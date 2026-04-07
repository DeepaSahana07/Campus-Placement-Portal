const router = require('express').Router();
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files allowed'), false);
}});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { name, department, year, cgpa, backlogs, skills, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, {
      name, department, year, cgpa, backlogs, skills, phone
    }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    const resume_url = '/uploads/resumes/' + req.file.filename;
    await User.findByIdAndUpdate(req.user.id, { resume_url });
    res.json({ resume_url });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { status, cgpa, backlogs, department, year, name } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, {
       status, cgpa, backlogs, department, year, name 
    }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password').sort('name');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
