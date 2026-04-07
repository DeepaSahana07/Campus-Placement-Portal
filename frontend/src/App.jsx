import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentCompanies from '@/pages/student/StudentCompanies';
import StudentApplications from '@/pages/student/StudentApplications';
import StudentExperiences from '@/pages/student/StudentExperiences';
import StudentProfile from '@/pages/student/StudentProfile';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminCompanies from '@/pages/admin/AdminCompanies';
import AdminStudents from '@/pages/admin/AdminStudents';
import AdminApplications from '@/pages/admin/AdminApplications';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminExperiences from '@/pages/admin/AdminExperiences';
import NotFound from '@/pages/NotFound';

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
    <Route path="/student/companies" element={<ProtectedRoute requiredRole="student"><StudentCompanies /></ProtectedRoute>} />
    <Route path="/student/applications" element={<ProtectedRoute requiredRole="student"><StudentApplications /></ProtectedRoute>} />
    <Route path="/student/experiences" element={<ProtectedRoute requiredRole="student"><StudentExperiences /></ProtectedRoute>} />
    <Route path="/student/profile" element={<ProtectedRoute requiredRole="student"><StudentProfile /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/companies" element={<ProtectedRoute requiredRole="admin"><AdminCompanies /></ProtectedRoute>} />
    <Route path="/admin/students" element={<ProtectedRoute requiredRole="admin"><AdminStudents /></ProtectedRoute>} />
    <Route path="/admin/applications" element={<ProtectedRoute requiredRole="admin"><AdminApplications /></ProtectedRoute>} />
    <Route path="/admin/analytics" element={<ProtectedRoute requiredRole="admin"><AdminAnalytics /></ProtectedRoute>} />
    <Route path="/admin/experiences" element={<ProtectedRoute requiredRole="admin"><AdminExperiences /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
