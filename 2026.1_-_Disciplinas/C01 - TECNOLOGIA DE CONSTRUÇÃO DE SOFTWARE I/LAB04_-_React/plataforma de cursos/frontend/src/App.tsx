import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider }                          from './context/AppContext';
import { useApp }                               from './hooks/useApp';
import BootstrapLayout                          from './components/layout/BootstrapLayout';
import Dashboard                                from './pages/dashboard/Dashboard';
import CoursePlayer                             from './pages/cursos/CoursePlayer';
import Explore                                  from './pages/explore/Explore';
import Profile                                  from './pages/profile/Profile';
import CourseDetails                            from './pages/cursos/CourseDetails';
import Cursos                                   from './pages/cursos/Cursos';
import Trilhas                                  from './pages/trilhas/Trilhas';
import CheckoutPlanos                           from './pages/checkout/CheckoutPlanos';
import AdminDashboard                           from './pages/admin/AdminDashboard';
import Login                                    from './pages/auth/Login';
import Register                                 from './pages/auth/Register';
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

  const isAdmin = currentUser?.perfil === 'administrador';
  const isInstructor = currentUser?.perfil === 'instrutor';

  // Redirect to dashboard if authenticated and trying to access login/register
  if (currentUser && (location.pathname === '/login' || location.pathname === '/register')) {
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (isInstructor) return <Navigate to="/instrutor" replace />;
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
        <Route path="/" element={<Navigate to={isAdmin ? "/admin" : isInstructor ? "/instrutor" : "/dashboard"} replace />} />
        <Route path="/dashboard" element={isAdmin ? <Navigate to="/admin" replace /> : isInstructor ? <Navigate to="/instrutor" replace /> : <Dashboard />} />
        <Route path="/player" element={isAdmin ? <Navigate to="/admin" replace /> : isInstructor ? <Navigate to="/instrutor" replace /> : <CoursePlayer />} />
        <Route path="/player/:id" element={isAdmin ? <Navigate to="/admin" replace /> : isInstructor ? <Navigate to="/instrutor" replace /> : <CoursePlayer />} />
        <Route path="/explore" element={isAdmin ? <Navigate to="/admin" replace /> : isInstructor ? <Navigate to="/instrutor" replace /> : <Explore />} />
        <Route path="/profile" element={isAdmin ? <Navigate to="/admin" replace /> : isInstructor ? <Navigate to="/instrutor" replace /> : <Profile />} />
        <Route path="/course/:id" element={isAdmin ? <Navigate to="/admin" replace /> : isInstructor ? <Navigate to="/instrutor" replace /> : <CourseDetails />} />
        <Route path="/cursos" element={isAdmin ? <Navigate to="/admin" replace /> : isInstructor ? <Navigate to="/instrutor" replace /> : <Cursos />} />
        <Route path="/trilhas" element={isAdmin ? <Navigate to="/admin" replace /> : isInstructor ? <Navigate to="/instrutor" replace /> : <Trilhas />} />
        <Route path="/checkout" element={isAdmin ? <Navigate to="/admin" replace /> : isInstructor ? <Navigate to="/instrutor" replace /> : <CheckoutPlanos />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />} />
        <Route path="/instrutor" element={isInstructor ? (
          <div className="card bg-black border border-secondary text-white p-5 text-center shadow-sm my-4">
            <h2 className="fw-bold mb-3 text-warning">Área do Instrutor</h2>
            <p className="text-muted mb-0 fs-5">Em breve...</p>
          </div>
        ) : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={isAdmin ? "/admin" : isInstructor ? "/instrutor" : "/dashboard"} replace />} />
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
