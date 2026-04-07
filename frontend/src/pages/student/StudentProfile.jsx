import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';
import { Save, Upload } from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Artificial Intelligence', 'Data Science',
];

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', department: '', year: 1, cgpa: 0, backlogs: 0, skills: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/profiles/me').then(r => {
      setProfile(r.data);
      setForm({
        name: r.data.name || '',
        department: r.data.department || '',
        year: r.data.year ?? 1,
        cgpa: r.data.cgpa || 0,
        backlogs: r.data.backlogs ?? 0,
        skills: (r.data.skills || []).join(', '),
        phone: r.data.phone || '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/profiles/me', {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setProfile(res.data);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await api.post('/profiles/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(p => ({ ...p, resume_url: res.data.resume_url }));
      toast.success('Resume uploaded!');
    } catch (err) { toast.error('Upload failed'); }
  };

  if (loading) return <DashboardLayout><div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Keep your profile updated for eligibility checks</p>
        </div>

        <div className="dashboard-section p-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label-text">Full Name</label><input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="input-field" /></div>
            <div><label className="label-text">Phone</label><input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} className="input-field" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">Department</label>
              <select value={form.department} onChange={e => setForm(p => ({...p, department: e.target.value}))} className="select-field">
                <option value="">Select</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div><label className="label-text">Year</label><input type="number" min={1} max={5} value={form.year} onChange={e => setForm(p => ({...p, year: parseInt(e.target.value) || 1}))} className="input-field" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">CGPA</label>
              <input 
                type="number" 
                step="0.01" 
                min={0} 
                max={10} 
                placeholder="e.g. 9.50"
                value={form.cgpa} 
                onChange={e => setForm(p => ({...p, cgpa: e.target.value === '' ? '' : parseFloat(e.target.value)}))} 
                className="input-field" 
              />
              <p className="mt-1 text-[10px] text-muted-foreground italic">Current format: x.xx (e.g. 9.50)</p>
            </div>
            <div><label className="label-text">Backlogs</label><input type="number" min={0} value={form.backlogs} onChange={e => setForm(p => ({...p, backlogs: parseInt(e.target.value) || 0}))} className="input-field" /></div>
          </div>
          <div><label className="label-text">Skills (comma separated)</label><input placeholder="React, Python, SQL" value={form.skills} onChange={e => setForm(p => ({...p, skills: e.target.value}))} className="input-field" /></div>
          <div>
            <label className="label-text">Resume</label>
            <div className="mt-1 flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                <Upload className="h-4 w-4" /> Upload Resume (PDF)
                <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
              </label>
              {profile?.resume_url && <span className="text-xs text-success">✓ Uploaded</span>}
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="mr-2 h-4 w-4" /> Save Profile
          </button>
        </div>

        {profile?.is_placed && (
          <div className="rounded-lg bg-success/10 border border-success/20 p-4 text-sm text-success">
            🎉 Congratulations! You've been placed at <strong>{profile.placed_company}</strong>
            {profile.placed_ctc && <> with ₹{Number(profile.placed_ctc).toLocaleString()} LPA</>}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
