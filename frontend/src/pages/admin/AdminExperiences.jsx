import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';
import { Trash2, Star, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/experiences').then(r => setExperiences(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try { await api.put(`/experiences/${id}/approve`); toast.success('Approved!'); load(); }
    catch { toast.error('Error'); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/experiences/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Error'); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Experience Moderation</h1>
          <p className="text-muted-foreground">Approve or remove interview experiences</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
        ) : !experiences.length ? (
          <p className="py-12 text-center text-muted-foreground">No experiences to moderate.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {experiences.map(exp => (
              <div key={exp._id} className="dashboard-section p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company_id?.name} • {exp.student_id?.name}</p>
                  </div>
                  <div className="flex gap-0.5">{Array.from({length: 5}).map((_,i) => (
                    <Star key={i} className={`h-4 w-4 ${i < (exp.rating ?? 0) ? 'fill-warning text-warning' : 'text-muted-foreground/20'}`} />
                  ))}</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-4">{exp.content}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${exp.is_approved ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {exp.is_approved ? 'Approved' : 'Pending'}
                    </span>
                    <span className="text-xs text-muted-foreground">{format(new Date(exp.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex gap-1">
                    {!exp.is_approved && (
                      <button onClick={() => handleApprove(exp._id)} className="btn-ghost text-success"><CheckCircle className="h-4 w-4" /></button>
                    )}
                    <button onClick={() => handleDelete(exp._id)} className="btn-ghost text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminExperiences;
