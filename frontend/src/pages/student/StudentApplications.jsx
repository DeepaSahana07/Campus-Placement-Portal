import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { format } from 'date-fns';

const statusStyles = {
  pending: 'bg-warning/10 text-warning',
  shortlisted: 'bg-info/10 text-info',
  selected: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
};

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my').then(r => setApplications(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground">Track your placement applications</p>
        </div>

        <div className="dashboard-section overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
          ) : !applications.length ? (
            <p className="py-12 text-center text-muted-foreground">You haven't applied to any company yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Company</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Role</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">CTC</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Applied On</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app._id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-medium text-foreground">{app.company_id?.name}</td>
                      <td className="px-5 py-4 text-muted-foreground">{app.company_id?.role_offered}</td>
                      <td className="px-5 py-4 text-muted-foreground">₹{Number(app.company_id?.ctc).toLocaleString()} LPA</td>
                      <td className="px-5 py-4 text-muted-foreground">{format(new Date(app.applied_at), 'MMM dd, yyyy')}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[app.status] || ''}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
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

export default StudentApplications;
