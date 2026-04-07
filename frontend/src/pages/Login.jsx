import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import bgImage from '@/assets/bg.jpg';
import collegeLogo from '@/assets/college-logo.png';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, role } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const user = await signIn(email, password);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin' : '/student', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (role) {
    navigate(role === 'admin' ? '/admin' : '/student', { replace: true });
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <img src={bgImage} alt="Campus background" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-sm" />

      <div className="glass-card relative z-10 mx-4 w-full max-w-md rounded-2xl p-8 animate-fade-in">
        <div className="mb-6 flex flex-col items-center">
          <img src={collegeLogo} alt="College Logo" className="mb-4 h-20 w-auto" />
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="mt-1 text-sm text-white/70">Campus Placement Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="label-glass">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input id="email" type="email" placeholder="you@college.edu" value={email}
                onChange={(e) => setEmail(e.target.value)} className="input-glass" required />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="label-glass">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input id="password" type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} className="input-glass" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2"><LogIn className="h-4 w-4" /> Sign In</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-white hover:text-white/80 underline underline-offset-4">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
