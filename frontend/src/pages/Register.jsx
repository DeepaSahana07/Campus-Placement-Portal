import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import bgImage from '@/assets/bg.jpg';
import collegeLogo from '@/assets/college-logo.png';
import { UserPlus, Mail, Lock, User, GraduationCap } from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Artificial Intelligence', 'Data Science',
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', department: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const update = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await signUp(form.email, form.password, { name: form.name, department: form.role === 'student' ? form.department : 'TPO', role: form.role });
      toast.success('Registration successful!');
      navigate(user.role === 'admin' ? '/admin' : '/student', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <img src={bgImage} alt="Campus background" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-sm" />

      <div className="glass-card relative z-10 mx-4 w-full max-w-md rounded-2xl p-8 animate-fade-in my-8">
        <div className="mb-6 flex flex-col items-center">
          <img src={collegeLogo} alt="College Logo" className="mb-4 h-20 w-auto" />
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="mt-1 text-sm text-white/70">Join the Placement Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="label-glass">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input placeholder="John Doe" value={form.name} onChange={(e) => update('name', e.target.value)} className="input-glass" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="label-glass">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input type="email" placeholder="you@college.edu" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-glass" required />
            </div>
          </div>

          {form.role === 'student' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <label className="label-glass">Department</label>
              <select value={form.department} onChange={(e) => update('department', e.target.value)} className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 shadow-sm" required>
                <option value="" className="text-black">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="label-glass">Role</label>
            <select value={form.role} onChange={(e) => update('role', e.target.value)} className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40">
              <option value="student" className="text-black">Student</option>
              <option value="admin" className="text-black">TPO / Admin</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="label-glass">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input type="password" placeholder="••••••" value={form.password} onChange={(e) => update('password', e.target.value)} className="input-glass" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="label-glass">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input type="password" placeholder="••••••" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="input-glass" required />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Register</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-white hover:text-white/80 underline underline-offset-4">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
