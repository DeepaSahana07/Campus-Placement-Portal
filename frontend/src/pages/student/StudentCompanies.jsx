import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';
import { DollarSign, MapPin, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const StudentCompanies = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/profiles/me'),
      api.get('/companies'),
      api.get('/applications/my'),
    ]).then(([p, c, a]) => {
      setProfile(p.data);
      setCompanies(c.data);
      setMyApps(a.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const checkEligibility = (company) => {
    if (!profile) return { eligible: false, reason: 'Complete your profile first' };
    if (profile.is_placed) return { eligible: false, reason: 'Already placed' };
    if (company.eligibility_cgpa && profile.cgpa < company.eligibility_cgpa)
      return { eligible: false, reason: `Min CGPA: ${company.eligibility_cgpa}` };
    if (company.eligibility_max_backlogs !== null && (profile.backlogs ?? 0) > company.eligibility_max_backlogs)
      return { eligible: false, reason: `Max backlogs: ${company.eligibility_max_backlogs}` };
    if (company.eligibility_departments?.length && !company.eligibility_departments.includes(profile.department))
      return { eligible: false, reason: 'Department not eligible' };
    if (company.deadline && new Date(company.deadline) < new Date())
      return { eligible: false, reason: 'Deadline passed' };
    return { eligible: true, reason: '' };
  };

  const appliedMap = new Map(myApps.map(a => [a.company_id?._id || a.company_id, a.status]));

  const handleApply = async (companyId) => {
    setApplying(companyId);
    try {
      await api.post('/applications', { company_id: companyId });
      toast.success('Application submitted!');
      const res = await api.get('/applications/my');
      setMyApps(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally { setApplying(null); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Placement Drives</h1>
          <p className="text-muted-foreground">Browse and apply to active placement opportunities</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
        ) : !companies.length ? (
          <div className="py-12 text-center text-muted-foreground">No placement drives available yet.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {companies.map(company => {
              const { eligible, reason } = checkEligibility(company);
              const appStatus = appliedMap.get(company._id);
              return (
                <div key={company._id} className="dashboard-section overflow-hidden transition-all hover:shadow-md">
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.role_offered}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        company.status === 'active' ? 'bg-success/10 text-success' :
                        company.status === 'upcoming' ? 'bg-info/10 text-info' :
                        'bg-muted text-muted-foreground'
                      }`}>{company.status}</span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> ₹{Number(company.ctc).toLocaleString()} LPA</div>
                      {company.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {company.location}</div>}
                      {company.deadline && <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Deadline: {format(new Date(company.deadline), 'MMM dd, yyyy')}</div>}
                    </div>

                    <div className="mt-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Eligibility</p>
                      <div className="flex flex-wrap gap-2">
                        {company.eligibility_cgpa > 0 && <span className="rounded bg-muted px-2 py-0.5">CGPA ≥ {company.eligibility_cgpa}</span>}
                        {company.eligibility_max_backlogs !== null && <span className="rounded bg-muted px-2 py-0.5">Backlogs ≤ {company.eligibility_max_backlogs}</span>}
                      </div>
                    </div>

                    <div className="mt-4">
                      {appStatus ? (
                        <div className={`flex items-center gap-2 text-sm font-medium ${
                          appStatus === 'selected' ? 'text-success' :
                          appStatus === 'rejected' ? 'text-destructive' :
                          'text-info'
                        }`}>
                          {appStatus === 'selected' ? <CheckCircle className="h-4 w-4" /> :
                           appStatus === 'rejected' ? <XCircle className="h-4 w-4" /> :
                           <Clock className="h-4 w-4" />}
                          {appStatus.charAt(0).toUpperCase() + appStatus.slice(1)}
                        </div>
                      ) : eligible ? (
                        <button onClick={() => handleApply(company._id)} disabled={applying === company._id} className="btn-primary w-full">
                          Apply Now
                        </button>
                      ) : (
                        <p className="text-sm text-destructive flex items-center gap-1"><XCircle className="h-4 w-4" /> {reason}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCompanies;
