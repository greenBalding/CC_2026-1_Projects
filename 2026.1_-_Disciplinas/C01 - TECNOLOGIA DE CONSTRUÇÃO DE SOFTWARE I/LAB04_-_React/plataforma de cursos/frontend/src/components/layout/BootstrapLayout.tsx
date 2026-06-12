import { useState }                                     from 'react';
import { Link, useLocation }                            from 'react-router-dom';
import type { ReactNode }                               from 'react';
import { useApp }                                       from '../../hooks/useApp';
import { Home, Search, Play, Map, Star, Crown, LogOut } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export default function BootstrapLayout({ children }: Props) {
  const { currentUser, setCurrentUser, assinaturas, planos } = useApp();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  const userSubs = currentUser
    ? assinaturas.filter((a) => a.idUsuario === currentUser.idUsuario)
    : [];
  const userSub = userSubs.length > 0 ? userSubs[userSubs.length - 1] : null;
  const freePlan = planos.find((p) => p.preco === 0) || null;
  const activePlan = userSub
    ? planos.find((p) => p.idPlano === userSub.idPlano) || freePlan
    : freePlan;

  const isStaff = currentUser?.perfil === 'administrador' || currentUser?.perfil === 'instrutor';
  const navItems = isStaff
    ? [
        { to: '/admin', icon: <Crown size={18} />, label: 'Painel Admin' },
      ]
    : [
        { to: '/dashboard', icon: <Home size={18} />, label: 'Início' },
        { to: '/explore', icon: <Search size={18} />, label: 'Explorar' },
        { to: '/cursos', icon: <Play size={18} />, label: 'Meus Cursos' },
        { to: '/trilhas', icon: <Map size={18} />, label: 'Trilhas' },
        { to: '/checkout', icon: <Star size={18} />, label: 'Planos & Premium' },
      ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      {/* Navbar Superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-secondary sticky-top px-3">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="btn btn-link text-light p-0 me-3 d-flex align-items-center justify-content-center"
              style={{
                width: '38px',
                height: '38px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
              title={collapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <Link className="navbar-brand fw-bold text-primary fs-3 d-flex align-items-center m-0" to="/dashboard">
              LearnGPT
            </Link>
          </div>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {/* Informações do Usuário */}
              {currentUser && (
                <Link
                  to="/profile"
                  className="d-flex align-items-center gap-2 text-decoration-none text-light"
                  style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  title="Acessar Meu Perfil"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-primary"
                    style={{ width: '38px', height: '38px', fontSize: '14px' }}
                  >
                    {currentUser.nome.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="d-none d-sm-block">
                    <div className="fw-semibold small lh-1">{currentUser.nome}</div>
                    <div className="text-muted small mt-1 text-capitalize" style={{ fontSize: '10px' }}>
                      {isStaff ? currentUser.perfil : (activePlan ? activePlan.nome : 'Conta Gratuita')}
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout Area */}
      <div className="d-flex flex-row flex-grow-1">
        {/* Sidebar Lateral */}
        <nav
          className="bg-black border-end border-secondary p-2 p-md-3 d-flex flex-column"
          style={{
            width: collapsed ? '70px' : '240px',
            minWidth: collapsed ? '70px' : '240px',
            transition: 'width 0.25s ease, min-width 0.25s ease',
          }}
        >
          <div className="position-sticky pt-3 d-flex flex-column h-100 w-100">
            <ul className="nav nav-pills flex-column mb-auto gap-2">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.to ||
                  (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
                return (
                  <li key={item.to} className="nav-item">
                    <Link
                      to={item.to}
                      className={`nav-link d-flex align-items-center ${
                        collapsed ? 'justify-content-center py-2.5 px-0' : 'text-start py-2 px-3'
                      } ${
                        isActive ? 'active bg-primary text-white' : 'text-light bg-opacity-10 hover-bg-secondary'
                      }`}
                      style={{ borderRadius: '6px' }}
                      title={collapsed ? item.label : undefined}
                    >
                      {item.icon}
                      {!collapsed && <span className="ms-2 text-nowrap">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Botão Sair no rodapé da Sidebar */}
            <div className="mt-auto pt-3 border-top border-secondary border-opacity-25 w-100">
              <button
                onClick={() => setCurrentUser(null)}
                className={`w-100 btn d-flex align-items-center ${
                  collapsed ? 'justify-content-center px-0' : 'text-start px-3'
                } text-danger`}
                style={{
                  borderRadius: '6px',
                  border: '1px solid rgba(220, 53, 69, 0.25)',
                  padding: collapsed ? '10px 0' : '8px 12px',
                  backgroundColor: 'rgba(220, 53, 69, 0.05)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(220, 53, 69, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(220, 53, 69, 0.25)';
                }}
                title={collapsed ? 'Sair' : undefined}
              >
                <LogOut size={18} />
                {!collapsed && <span className="ms-2 fw-semibold text-nowrap">Sair</span>}
              </button>
            </div>
          </div>
        </nav>

        {/* Conteúdo Principal */}
        <main className="flex-grow-1 px-md-4 py-4 bg-dark overflow-auto">
          <div className="container-fluid">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
