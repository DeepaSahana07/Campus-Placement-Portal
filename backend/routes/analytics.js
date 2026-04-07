const router = require('express').Router();
const User = require('../models/User');
const Application = require('../models/Application');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    const applications = await Application.find().populate('company_id', 'name');
    
    const placed = students.filter(s => s.status === 'placed').length;
    const intern = students.filter(s => s.status === 'intern').length;
    const unplaced = students.filter(s => s.status === 'unplaced').length;
    
    const deptMap = {};
    students.forEach(s => {
      const dept = s.department || 'Unknown';
      if (!deptMap[dept]) deptMap[dept] = { total: 0, placed: 0, intern: 0 };
      deptMap[dept].total++;
      if (s.status === 'placed') deptMap[dept].placed++;
      if (s.status === 'intern') deptMap[dept].intern++;
    });
    const deptData = Object.entries(deptMap).map(([name, v]) => ({ 
      name: name.substring(0, 15), 
      placed: v.placed, 
      intern: v.intern,
      total: v.total 
    }));
    
    const companyMap = {};
    applications.forEach(a => {
      const name = a.company_id?.name || 'Unknown';
      companyMap[name] = (companyMap[name] || 0) + 1;
    });
    const companyData = Object.entries(companyMap).map(([name, count]) => ({ name, applications: count })).slice(0, 10);
    
    const statusMap = {};
    applications.forEach(a => { statusMap[a.status] = (statusMap[a.status] || 0) + 1; });
    const statusData = Object.entries(statusMap).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    
    res.json({ placed, intern, unplaced, deptData, companyData, statusData, totalStudents: students.length, totalApplications: applications.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
