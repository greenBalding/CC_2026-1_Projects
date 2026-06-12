import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './hooks/useApp';
import BootstrapLayout from './components/layout/BootstrapLayout';
import Dashboard from './pages/dashboard/Dashboard';
import CoursePlayer from './pages/cursos/CoursePlayer';
import Explore from './pages/explore/Explore';
import Profile from './pages/profile/Profile';
import CourseDetails from './pages/cursos/CourseDetails';
import Cursos from './pages/cursos/Cursos';
import Trilhas from './pages/trilhas/Trilhas';
import CheckoutPlanos from './pages/checkout/CheckoutPlanos';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import './index.css';

function AppRoutes() {
  const { currentUser, loading } = useApp();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando dados da plataforma...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if authenticated and trying to access login/register
  if (currentUser && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render Login and Register pages standalone (no sidebars/headers)
  if (location.pathname === '/login' || location.pathname === '/register') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Render main layout and pages
  return (
    <BootstrapLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/player" element={<CoursePlayer />} />
        <Route path="/player/:id" element={<CoursePlayer />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/trilhas" element={<Trilhas />} />
        <Route path="/checkout" element={<CheckoutPlanos />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BootstrapLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
