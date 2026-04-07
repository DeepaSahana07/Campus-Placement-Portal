import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Building2, FileText, Users, BarChart3,
  MessageSquare, User, LogOut, Menu, X, ChevronRight, GraduationCap,
} from 'lucide-react';

const studentNav = [
  { label: 'Dashboard', path: '/student', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Companies', path: '/student/companies', icon: <Building2 className="h-5 w-5" /> },
  { label: 'My Applications', path: '/student/applications', icon: <FileText className="h-5 w-5" /> },
  { label: 'Experiences', path: '/student/experiences', icon: <MessageSquare className="h-5 w-5" /> },
  { label: 'Profile', path: '/student/profile', icon: <User className="h-5 w-5" /> },
];

const adminNav = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Companies', path: '/admin/companies', icon: <Building2 className="h-5 w-5" /> },
  { label: 'Students', path: '/admin/students', icon: <Users className="h-5 w-5" /> },
  { label: 'Applications', path: '/admin/applications', icon: <FileText className="h-5 w-5" /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Experiences', path: '/admin/experiences', icon: <MessageSquare className="h-5 w-5" /> },
];

const DashboardLayout = ({ children }) => {
  const { role, user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = role === 'admin' ? adminNav : studentNav;

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <GraduationCap className="h-7 w-7 text-sidebar-primary" />
          <div>
            <h2 className="text-sm font-bold text-sidebar-foreground">Placement Portal</h2>
            <p className="text-xs text-sidebar-foreground/60">{role === 'admin' ? 'TPO Panel' : 'Student Panel'}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 text-xs text-sidebar-foreground/50 truncate">{user?.name || user?.email}</div>
          <button
            onClick={handleLogout}
            className="btn-ghost w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-6 backdrop-blur-md">
          <button className="btn-ghost lg:hidden" onClick={() => setSidebarOpen(true)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden text-sm font-medium text-foreground sm:inline">{user?.name || user?.email}</span>
          </div>
        </header>

        <main className="flex-1 p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
