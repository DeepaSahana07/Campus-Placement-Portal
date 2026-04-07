import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, FileDown, Filter, UserCheck, UserMinus, GraduationCap, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Artificial Intelligence', 'Data Science',
];

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ department: '', minCgpa: '', status: '' });

  const load = () => {
    setLoading(true);
    api.get('/profiles/all')
      .then(r => setStudents(r.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/profiles/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setStudents(prev => prev.map(s => s._id === id ? { ...s, status: newStatus } : s));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const exportToExcel = () => {
    const dataToExport = filtered.map(s => ({
      Name: s.name,
      Email: s.email,
      Department: s.department,
      Year: s.year,
      CGPA: s.cgpa?.toFixed(2),
      Backlogs: s.backlogs,
      Status: s.status?.toUpperCase(),
      Phone: s.phone || 'N/A'
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `Students_Data_${new Date().toLocaleDateString()}.xlsx`);
    toast.success('Excel file downloaded!');
  };

  const filtered = students.filter(s => {
    const matchesSearch = !search || 
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !filters.department || s.department === filters.department;
    const matchesStatus = !filters.status || s.status === filters.status;
    const matchesCgpa = !filters.minCgpa || s.cgpa >= parseFloat(filters.minCgpa);
    return matchesSearch && matchesDept && matchesStatus && matchesCgpa;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
            <p className="text-muted-foreground">Monitor and manage student profiles and placements</p>
          </div>
          <button onClick={exportToExcel} className="btn-secondary w-fit">
            <FileDown className="mr-2 h-4 w-4" /> Export Excel
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search name/email..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={filters.department} onChange={e => setFilters(f => ({...f, department: e.target.value}))} className="select-field">
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filters.status} onChange={e => setFilters(f => ({...f, status: e.target.value}))} className="select-field">
            <option value="">All Status</option>
            <option value="unplaced">Unplaced</option>
            <option value="placed">Placed</option>
            <option value="intern">Intern</option>
          </select>
          <input type="number" step="0.1" placeholder="Min CGPA" value={filters.minCgpa} onChange={e => setFilters(f => ({...f, minCgpa: e.target.value}))} className="input-field" />
        </div>

        <div className="dashboard-section overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold">Student Info</th>
                    <th className="px-5 py-4 text-left font-semibold">Department & Year</th>
                    <th className="px-5 py-4 text-left font-semibold">Academic</th>
                    <th className="px-5 py-4 text-left font-semibold">Resume</th>
                    <th className="px-5 py-4 text-left font-semibold">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(s => (
                    <tr key={s._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-foreground">{s.name || 'No Name'}</div>
                        <div className="text-xs text-muted-foreground">{s.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-foreground">{s.department || '—'}</span>
                          <span className="text-xs text-muted-foreground">Year {s.year || 1}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-primary">{s.cgpa?.toFixed(2)} CGPA</span>
                          <span className={`${s.backlogs > 0 ? 'text-destructive' : 'text-success'} text-xs`}>{s.backlogs} Backlogs</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {s.resume_url ? (
                          <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${s.resume_url}`} 
                             target="_blank" rel="noopener noreferrer" 
                             className="flex items-center gap-1.5 text-primary hover:underline font-medium">
                            <ExternalLink className="h-4 w-4" /> View PDF
                          </a>
                        ) : <span className="text-muted-foreground text-xs italic">Not uploaded</span>}
                      </td>
                      <td className="px-5 py-4">
                        <select 
                          value={s.status || 'unplaced'} 
                          onChange={(e) => handleStatusChange(s._id, e.target.value)}
                          className={`rounded-lg border-0 px-3 py-1.5 text-xs font-semibold shadow-sm focus:ring-2 focus:ring-primary/20 ${
                            s.status === 'placed' ? 'bg-success/10 text-success' : 
                            s.status === 'intern' ? 'bg-info/10 text-info' : 
                            'bg-muted text-muted-foreground'
                          }`}
                        >
                          <option value="unplaced">Unplaced</option>
                          <option value="placed">Placed</option>
                          <option value="intern">Intern</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filtered.length && (
                <div className="py-12 text-center text-muted-foreground bg-muted/10">No students found matching your criteria.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
