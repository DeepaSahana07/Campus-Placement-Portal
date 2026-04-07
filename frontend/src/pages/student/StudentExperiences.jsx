import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';
import { Star, Plus, X } from 'lucide-react';
import { format } from 'date-fns';

const StudentExperiences = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ company_id: '', title: '', content: '', rating: 3 });

  const load = async () => {
    setLoading(true);
    try {
      const [expsRes, companiesRes] = await Promise.all([
        api.get('/experiences'),
        api.get('/companies')
      ]);
      setExperiences(expsRes.data);
      setCompanies(companiesRes.data);
    } catch (err) {
      toast.error('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    try {
      await api.post('/experiences', form);
      toast.success('Experience submitted for approval!');
      setOpen(false);
      setForm({ company_id: '', title: '', content: '', rating: 3 });
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Interview Experiences</h1>
            <p className="text-muted-foreground">Learn from peers' interview experiences</p>
          </div>
          <button onClick={() => setOpen(true)} className="btn-primary"><Plus className="mr-2 h-4 w-4" /> Share Experience</button>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
            <div className="bg-card rounded-xl p-6 w-full max-w-lg mx-4 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">Share Your Interview Experience</h2>
                <button onClick={() => setOpen(false)} className="btn-ghost"><X className="h-5 w-5" /></button>
              </div>
              <div>
                <label className="label-text">Company</label>
                <select value={form.company_id} onChange={e => setForm(p => ({...p, company_id: e.target.value}))} className="select-field">
                  <option value="">Select company</option>
                  {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label-text">Title</label>
                <input placeholder="e.g. SDE-1 Interview at Google" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="input-field" />
              </div>
              <div>
                <label className="label-text">Experience</label>
                <textarea rows={5} placeholder="Describe the rounds, questions, tips..." value={form.content} onChange={e => setForm(p => ({...p, content: e.target.value}))} className="input-field" />
              </div>
              <div>
                <label className="label-text">Rating (1-5)</label>
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(p => ({...p, rating: n}))}
                      className={`p-1 ${n <= form.rating ? 'text-warning' : 'text-muted-foreground/30'}`}>
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={!form.company_id || !form.title || !form.content} className="btn-primary w-full">Submit Experience</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
        ) : !experiences.length ? (
          <p className="py-12 text-center text-muted-foreground">No experiences shared yet. Be the first!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {experiences.map(exp => (
              <div key={exp._id} className="dashboard-section p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company_id?.name} • {exp.student_id?.name || 'Anonymous'}</p>
                  </div>
                  <div className="flex gap-0.5">{Array.from({length: 5}).map((_,i) => (
                    <Star key={i} className={`h-4 w-4 ${i < (exp.rating ?? 0) ? 'fill-warning text-warning' : 'text-muted-foreground/20'}`} />
                  ))}</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{exp.content}</p>
                <p className="mt-3 text-xs text-muted-foreground/60">{format(new Date(exp.createdAt), 'MMM dd, yyyy')}</p>
                {!exp.is_approved && exp.student_id?._id === user?.id && (
                  <span className="mt-2 inline-block rounded bg-warning/10 px-2 py-0.5 text-xs text-warning">Pending approval</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentExperiences;
