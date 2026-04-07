import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Artificial Intelligence', 'Data Science',
];

const emptyForm = { name: '', role_offered: '', ctc: '', location: '', description: '', eligibility_cgpa: '', eligibility_max_backlogs: '0', eligibility_departments: [], deadline: '', status: 'active' };

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => api.get('/companies').then(r => setCompanies(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const payload = {
      name: form.name, role_offered: form.role_offered, ctc: parseFloat(form.ctc),
      location: form.location || null, description: form.description || null,
      eligibility_cgpa: form.eligibility_cgpa ? parseFloat(form.eligibility_cgpa) : 0,
      eligibility_max_backlogs: parseInt(form.eligibility_max_backlogs) || 0,
      eligibility_departments: form.eligibility_departments,
      deadline: form.deadline || null, status: form.status,
    };
    try {
      if (editId) await api.put(`/companies/${editId}`, payload);
      else await api.post('/companies', payload);
      toast.success(editId ? 'Company updated!' : 'Company created!');
      setOpen(false); setForm(emptyForm); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/companies/${id}`); toast.success('Company deleted'); load(); }
    catch (err) { toast.error('Error'); }
  };

  const openEdit = (c) => {
    setEditId(c._id);
    setForm({
      name: c.name, role_offered: c.role_offered, ctc: String(c.ctc),
      location: c.location || '', description: c.description || '',
      eligibility_cgpa: c.eligibility_cgpa ? String(c.eligibility_cgpa) : '',
      eligibility_max_backlogs: String(c.eligibility_max_backlogs ?? 0),
      eligibility_departments: c.eligibility_departments || [],
      deadline: c.deadline ? c.deadline.split('T')[0] : '', status: c.status,
    });
    setOpen(true);
  };

  const toggleDept = (dept) => {
    setForm(p => ({
      ...p,
      eligibility_departments: p.eligibility_departments.includes(dept)
        ? p.eligibility_departments.filter(d => d !== dept)
        : [...p.eligibility_departments, dept],
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Companies</h1>
            <p className="text-muted-foreground">Create and manage placement drives</p>
          </div>
          <button onClick={() => { setEditId(null); setForm(emptyForm); setOpen(true); }} className="btn-primary"><Plus className="mr-2 h-4 w-4" /> Add Company</button>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setOpen(false); setEditId(null); setForm(emptyForm); }}>
            <div className="bg-card rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">{editId ? 'Edit' : 'Add'} Company</h2>
                <button onClick={() => { setOpen(false); setEditId(null); setForm(emptyForm); }} className="btn-ghost"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label-text">Company Name *</label><input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="input-field" /></div>
                <div><label className="label-text">Role Offered *</label><input value={form.role_offered} onChange={e => setForm(p => ({...p, role_offered: e.target.value}))} className="input-field" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label-text">CTC (LPA) *</label><input type="number" value={form.ctc} onChange={e => setForm(p => ({...p, ctc: e.target.value}))} className="input-field" /></div>
                <div><label className="label-text">Location</label><input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} className="input-field" /></div>
              </div>
              <div><label className="label-text">Description</label><textarea rows={3} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="input-field" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label-text">Min CGPA</label><input type="number" step="0.1" value={form.eligibility_cgpa} onChange={e => setForm(p => ({...p, eligibility_cgpa: e.target.value}))} className="input-field" /></div>
                <div><label className="label-text">Max Backlogs</label><input type="number" value={form.eligibility_max_backlogs} onChange={e => setForm(p => ({...p, eligibility_max_backlogs: e.target.value}))} className="input-field" /></div>
              </div>
              <div>
                <label className="label-text">Eligible Departments</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {DEPARTMENTS.map(d => (
                    <button key={d} type="button" onClick={() => toggleDept(d)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        form.eligibility_departments.includes(d) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                      }`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label-text">Deadline</label><input type="date" value={form.deadline} onChange={e => setForm(p => ({...p, deadline: e.target.value}))} className="input-field" /></div>
                <div>
                  <label className="label-text">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))} className="select-field">
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSave} disabled={!form.name || !form.role_offered || !form.ctc} className="btn-primary w-full">{editId ? 'Update' : 'Create'} Company</button>
            </div>
          </div>
        )}

        <div className="dashboard-section overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
          ) : !companies.length ? (
            <p className="py-12 text-center text-muted-foreground">No companies yet. Add your first placement drive!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Company</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Role</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">CTC</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Deadline</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map(c => (
                    <tr key={c._id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-medium text-foreground">{c.name}</td>
                      <td className="px-5 py-4 text-muted-foreground">{c.role_offered}</td>
                      <td className="px-5 py-4 text-muted-foreground">₹{Number(c.ctc).toLocaleString()} LPA</td>
                      <td className="px-5 py-4 text-muted-foreground">{c.deadline ? format(new Date(c.deadline), 'MMM dd, yyyy') : '—'}</td>
                      <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        c.status === 'active' ? 'bg-success/10 text-success' :
                        c.status === 'upcoming' ? 'bg-info/10 text-info' : 'bg-muted text-muted-foreground'
                      }`}>{c.status}</span></td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => openEdit(c)} className="btn-ghost"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(c._id)} className="btn-ghost text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCompanies;
