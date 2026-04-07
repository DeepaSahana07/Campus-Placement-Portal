import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCompany, setFilterCompany] = useState('all');

  const load = () => {
    Promise.all([api.get('/applications/all'), api.get('/companies')])
      .then(([a, c]) => { setApplications(a.data); setCompanies(c.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      toast.success('Status updated!');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const filtered = filterCompany === 'all' ? applications : applications.filter(a => (a.company_id?._id || a.company_id) === filterCompany);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Application Management</h1>
            <p className="text-muted-foreground">Review and update application statuses</p>
          </div>
          <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)} className="select-field w-[200px]">
            <option value="all">All Companies</option>
            {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="dashboard-section overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
          ) : !filtered.length ? (
            <p className="py-12 text-center text-muted-foreground">No applications found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Student</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Company</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">CGPA</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Applied</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(app => (
                    <tr key={app._id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{app.student_id?.name || '—'}</p>
                        <p className="text-xs text-muted-foreground">{app.student_id?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-foreground">{app.company_id?.name}</p>
                        <p className="text-xs text-muted-foreground">{app.company_id?.role_offered}</p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{Number(app.student_id?.cgpa ?? 0).toFixed(2)}</td>
                      <td className="px-5 py-4 text-muted-foreground">{format(new Date(app.applied_at), 'MMM dd, yyyy')}</td>
                      <td className="px-5 py-4">
                        <select value={app.status} onChange={e => updateStatus(app._id, e.target.value)} className="select-field h-8 w-[130px] text-xs">
                          <option value="pending">Pending</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
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

export default AdminApplications;
