import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Building2, Users, FileText, CheckCircle, TrendingUp, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get('/companies').then(r => setCompanies(r.data)).catch(() => {});
    api.get('/profiles/all').then(r => setStudents(r.data)).catch(() => {});
    api.get('/applications/all').then(r => setApplications(r.data)).catch(() => {});
  }, []);

  const placed = students.filter(s => s.is_placed).length;
  const stats = [
    { label: 'Total Companies', value: companies.length, icon: <Building2 className="h-6 w-6" />, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Students', value: students.length, icon: <Users className="h-6 w-6" />, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Applications', value: applications.length, icon: <FileText className="h-6 w-6" />, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Placed', value: placed, icon: <CheckCircle className="h-6 w-6" />, color: 'text-success', bg: 'bg-success/10' },
  ];
  const pendingApps = applications.filter(a => a.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">TPO Dashboard</h1>
          <p className="text-muted-foreground">Overview of placement activities</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{s.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${s.bg}`}><span className={s.color}>{s.icon}</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="dashboard-section p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"><TrendingUp className="h-5 w-5 text-primary" /> Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">Active Drives</span>
                <span className="font-semibold text-foreground">{companies.filter(c => c.status === 'active').length}</span>
              </div>
              <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">Pending Applications</span>
                <span className="font-semibold text-foreground">{pendingApps}</span>
              </div>
              <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">Placement Rate</span>
                <span className="font-semibold text-foreground">{students.length ? ((placed / students.length) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>

          <div className="dashboard-section p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"><Clock className="h-5 w-5 text-warning" /> Recent Applications</h2>
            {!applications.length ? (
              <p className="text-center text-muted-foreground py-8">No applications yet</p>
            ) : (
              <div className="space-y-2">
                {applications.slice(0, 5).map(a => (
                  <div key={a._id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm">
                    <span className="text-foreground">{a.student_id?.name || a.student_id?._id?.slice(0,8) + '...'}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      a.status === 'selected' ? 'bg-success/10 text-success' :
                      a.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
