import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Building2, FileText, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.get('/profiles/me').then(r => setProfile(r.data)).catch(() => {});
    api.get('/applications/my').then(r => setApplications(r.data)).catch(() => {});
    api.get('/companies/active').then(r => setCompanies(r.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Active Drives', value: companies.length, icon: <Building2 className="h-6 w-6" />, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Applications', value: applications.length, icon: <FileText className="h-6 w-6" />, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Selected', value: applications.filter(a => a.status === 'selected').length, icon: <CheckCircle className="h-6 w-6" />, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, icon: <Clock className="h-6 w-6" />, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {profile?.name || 'Student'}! 👋</h1>
          <p className="text-muted-foreground">Here's your placement overview</p>
        </div>

        {profile && (!profile.cgpa || !profile.department) && (
          <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
            <AlertCircle className="h-5 w-5 text-warning" />
            <p className="text-sm text-foreground">Complete your profile to apply for placement drives.</p>
          </div>
        )}

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

        <div className="dashboard-section">
          <div className="border-b border-border p-5">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Recent Applications
            </h2>
          </div>
          <div className="p-5">
            {!applications.length ? (
              <p className="py-8 text-center text-muted-foreground">No applications yet. Browse companies to get started!</p>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => (
                  <div key={app._id} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">{app.company_id?.name}</p>
                      <p className="text-sm text-muted-foreground">{app.company_id?.role_offered}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      app.status === 'selected' ? 'bg-success/10 text-success' :
                      app.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                      app.status === 'shortlisted' ? 'bg-info/10 text-info' :
                      'bg-warning/10 text-warning'
                    }`}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
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

export default StudentDashboard;
