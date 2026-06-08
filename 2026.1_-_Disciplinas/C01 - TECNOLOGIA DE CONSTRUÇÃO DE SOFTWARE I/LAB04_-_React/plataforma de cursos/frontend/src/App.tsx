import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import BootstrapLayout from './components/BootstrapLayout';
import Dashboard from './pages/hf/Dashboard';
import CoursePlayer from './pages/hf/CoursePlayer';
import Explore from './pages/hf/Explore';
import Profile from './pages/hf/Profile';
import CourseDetails from './pages/hf/CourseDetails';
import Cursos from './pages/hf/Cursos';
import Trilhas from './pages/hf/Trilhas';
import CheckoutPlanos from './pages/hf/CheckoutPlanos';
import AdminDashboard from './pages/hf/AdminDashboard';
import Login from './pages/Login';
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
  if (!currentUser && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (currentUser && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  // Render Login page standalone (no sidebars/headers)
  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
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
