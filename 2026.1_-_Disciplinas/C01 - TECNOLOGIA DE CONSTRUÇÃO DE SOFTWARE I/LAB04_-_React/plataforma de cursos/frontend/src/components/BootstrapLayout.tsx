import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import { HomeIcon, SearchIcon, PlayIcon, MapIcon, UserIcon, StarIcon, TrophyIcon } from './Icons';

interface Props {
  children: ReactNode;
}

export default function BootstrapLayout({ children }: Props) {
  const { currentUser, setCurrentUser, usuarios, assinaturas } = useApp();
  const location = useLocation();

  const handleUserChange = (userId: string) => {
    const user = usuarios.find((u) => u.idUsuario === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const isPro = currentUser
    ? assinaturas.some((a) => a.idUsuario === currentUser.idUsuario)
    : false;



  const navItems = [
    { to: '/dashboard', icon: <HomeIcon size={18} className="me-2" />, label: 'Início' },
    { to: '/explore', icon: <SearchIcon size={18} className="me-2" />, label: 'Explorar' },
    { to: '/cursos', icon: <PlayIcon size={18} className="me-2" />, label: 'Meus Cursos' },
    { to: '/trilhas', icon: <MapIcon size={18} className="me-2" />, label: 'Trilhas' },
    { to: '/checkout', icon: <StarIcon size={18} className="me-2" fill="none" />, label: 'Planos & Premium' },
    { to: '/profile', icon: <UserIcon size={18} className="me-2" />, label: 'Meu Perfil' },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      {/* Navbar Superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-secondary sticky-top px-3">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-primary fs-3 d-flex align-items-center" to="/dashboard">
            Learnify
          </Link>
          
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
              {/* Seletor de Usuário (Caso de Uso Interativo) */}
              <div className="d-flex align-items-center gap-2 bg-secondary bg-opacity-25 rounded px-2 py-1">
                <span className="text-muted small text-nowrap">Simular Usuário:</span>
                <select
                  className="form-select form-select-sm bg-dark text-light border-secondary"
                  value={currentUser?.idUsuario || ''}
                  onChange={(e) => handleUserChange(e.target.value)}
                  style={{ width: '180px' }}
                >
                  {usuarios.map((u) => (
                    <option key={u.idUsuario} value={u.idUsuario}>
                      {u.nome} ({u.perfil})
                    </option>
                  ))}
                </select>
              </div>

              {/* Informações do Usuário */}
              {currentUser && (
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-primary"
                    style={{ width: '38px', height: '38px', fontSize: '14px' }}
                  >
                    {currentUser.nome.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="d-none d-sm-block">
                    <div className="fw-semibold small lh-1 text-light">{currentUser.nome}</div>
                    <div className="text-muted small mt-1" style={{ fontSize: '10px' }}>
                      {isPro ? 'Assinante Pro' : 'Conta Gratuita'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <div className="container-fluid flex-grow-1">
        <div className="row min-vh-100">
          {/* Sidebar Lateral */}
          <nav className="col-md-3 col-lg-2 d-md-block bg-black sidebar border-end border-secondary p-3">
            <div className="position-sticky pt-3 d-flex flex-column h-100">
              <ul className="nav nav-pills flex-column mb-auto gap-2">
                {navItems.map((item) => {
                  const isActive =
                    location.pathname === item.to ||
                    (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
                  return (
                    <li key={item.to} className="nav-item">
                      <Link
                        to={item.to}
                        className={`nav-link text-start d-flex align-items-center ${
                          isActive ? 'active bg-primary text-white' : 'text-light bg-opacity-10 hover-bg-secondary'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Botão de Painel de Controle Admin */}
              <div className="mt-auto pt-3 border-top border-secondary">
                <Link
                  to="/admin"
                  className={`btn d-flex align-items-center justify-content-center w-100 ${
                    location.pathname.startsWith('/admin')
                      ? 'btn-danger'
                      : 'btn-outline-danger'
                  }`}
                  style={{ gap: '6px' }}
                >
                  <TrophyIcon size={16} />
                  <span>Painel Admin ({currentUser?.perfil === 'aluno' ? 'Bloqueado' : 'Acesso'})</span>
                </Link>
                {currentUser?.perfil === 'aluno' && (
                  <div className="text-center text-muted small mt-2" style={{ fontSize: '10px' }}>
                    *Troque o perfil no topo para acessar a administração
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Conteúdo Principal */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4 bg-dark">
            <div className="container-fluid">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
