import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StarIcon, PlayIcon, LockIcon } from '../../components/Icons';

export default function Dashboard() {
  const { currentUser, cursos, matriculas, progressoAulas, certificados, usuarios, modulos, aulas } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="alert alert-warning text-center mt-4" role="alert">
        Nenhum usuário logado. Por favor, selecione um usuário na barra superior.
      </div>
    );
  }

  // Get current user's enrollments
  const userMatriculas = matriculas.filter((m) => m.idUsuario === currentUser.idUsuario);
  
  // Helper to fetch counts dynamically:
  const getProgressInfo = (idCurso: string) => {
    const courseModules = modulos.filter((m) => m.idCurso === idCurso).map((m) => m.idModulo);
    const courseLessons = aulas.filter((a) => courseModules.includes(a.idModulo));
    const courseLessonsIds = courseLessons.map((a) => a.idAula);
    const completed = progressoAulas.filter(
      (p) => p.idUsuario === currentUser.idUsuario && courseLessonsIds.includes(p.idAula) && p.status === 'CONCLUIDO'
    );
    return {
      total: courseLessons.length || 1,
      completed: completed.length,
      percentage: courseLessons.length > 0 ? Math.round((completed.length / courseLessons.length) * 100) : 0,
    };
  };

  // Enrolled courses with active progress
  const activeEnrollments = userMatriculas.map((mat) => {
    const curso = cursos.find((c) => c.idCurso === mat.idCurso);
    const stats = curso ? getProgressInfo(curso.idCurso) : { percentage: 0 };
    return {
      ...mat,
      curso,
      progresso: stats.percentage,
    };
  });

  const enrolledIds = userMatriculas.map((m) => m.idCurso);
  const recommendedCourses = cursos.filter((c) => !enrolledIds.includes(c.idCurso)).slice(0, 3);

  const firstEnrollment = activeEnrollments[0];
  const heroCourse = firstEnrollment?.curso;
  const heroProgress = firstEnrollment?.progresso || 0;

  // Global user metrics
  const totalCompletedCursos = activeEnrollments.filter((e) => e.progresso === 100).length;
  const userCertificadosCount = certificados.filter((c) => c.idUsuario === currentUser.idUsuario).length;

  return (
    <div className="container-fluid py-2">
      {/* Hero Section */}
      {heroCourse ? (
        <div className="card border-0 mb-4 bg-gradient text-white shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #2a1a4a 0%, #111 100%)' }}>
          <div className="card-body p-4 p-md-5">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <span className="badge bg-primary px-3 py-2 rounded-pill mb-3 text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                  Continue Aprendendo
                </span>
                <h1 className="display-5 fw-bold mb-3">{heroCourse.titulo}</h1>
                <p className="lead text-muted-light mb-4" style={{ fontSize: '16px', color: '#cbd5e1' }}>
                  {heroCourse.descricao}
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <button
                    onClick={() => navigate(`/player/${heroCourse.idCurso}`)}
                    className="btn btn-primary btn-lg fw-bold px-4 d-flex align-items-center gap-2"
                  >
                    <PlayIcon size={18} fill="currentColor" /> Continuar Aula
                  </button>
                  <div className="text-light fs-6">
                    Seu progresso: <strong className="text-primary">{heroProgress}%</strong>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 d-none d-lg-block text-center">
                <div
                  className="mx-auto rounded-circle bg-opacity-10 bg-primary d-flex align-items-center justify-content-center"
                  style={{ width: '150px', height: '150px', border: '2px dashed #7c3aed' }}
                >
                  <span className="fs-3 text-primary fw-bold">LearnGPT</span>
                </div>
              </div>
            </div>
          </div>
          {/* Progress bar at the bottom of the card */}
          <div className="progress rounded-0" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${heroProgress}%` }}
              aria-valuenow={heroProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      ) : (
        <div className="card border-secondary bg-black bg-opacity-25 text-white mb-4 shadow-sm">
          <div className="card-body p-4 p-md-5 text-center">
            <span className="fs-3 mb-3 d-block">Bem-vindo(a), {currentUser.nome}!</span>
            <h2 className="fw-bold mb-3">Sua jornada de aprendizado começa aqui</h2>
            <p className="text-muted mb-4">Você ainda não está matriculado em nenhum curso. Visite o catálogo e encontre o curso ideal para você.</p>
            <button onClick={() => navigate('/explore')} className="btn btn-primary px-4 fw-semibold">
              Explorar Cursos
            </button>
          </div>
        </div>
      )}

      {/* Grid de Conteúdo Principal e Painel Lateral */}
      <div className="row">
        {/* Lado Esquerdo: Listas de Cursos */}
        <div className="col-lg-8 mb-4">
          {/* Meus Cursos */}
          {activeEnrollments.length > 0 && (
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-light mb-0">Meus Cursos</h3>
                <Link to="/cursos" className="btn btn-sm btn-outline-secondary text-light">Ver todos →</Link>
              </div>
              <div className="row g-3">
                {activeEnrollments.slice(0, 2).map((m) => {
                  const c = m.curso;
                  if (!c) return null;
                  const instrutorName = usuarios.find((u) => u.idUsuario === c.idInstrutor)?.nome || 'Instrutor';
                  return (
                    <div className="col-md-6" key={m.idMatricula}>
                      <div
                        className="card bg-black border border-secondary text-white h-100 shadow-sm hover-card overflow-hidden"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('button, a')) {
                            return;
                          }
                          navigate(`/player/${c.idCurso}`);
                        }}
                      >
                        {c.bannerUrl ? (
                          <img
                            src={c.bannerUrl}
                            alt={c.titulo}
                            className="w-100"
                            style={{
                              aspectRatio: '16 / 9',
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <div
                            className="w-100 d-flex align-items-center justify-content-center text-muted"
                            style={{
                              aspectRatio: '16 / 9',
                              background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.1) 100%)',
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                              fontSize: '14px',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Em breve...
                          </div>
                        )}
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <span className="badge bg-secondary text-uppercase small" style={{ fontSize: '9px' }}>
                                {c.nivel}
                              </span>
                            </div>
                            <h5 className="card-title fw-bold text-light mb-2">{c.titulo}</h5>
                            <p className="text-muted small mb-3">por {instrutorName}</p>
                          </div>
                          
                          <div className="mt-auto pt-3 border-top border-secondary">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="text-muted small">Progresso</span>
                              <span className="fw-bold text-primary small">{m.progresso}%</span>
                            </div>
                            <div className="progress bg-dark" style={{ height: '6px' }}>
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: `${m.progresso}%` }}
                                aria-valuenow={m.progresso}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                            <button
                              onClick={() => navigate(`/player/${c.idCurso}`)}
                              className="btn btn-sm btn-outline-primary w-100 fw-semibold mt-3"
                            >
                              Acessar Aulas
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cursos Recomendados */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-light mb-0">Recomendados para Você</h3>
              <Link to="/explore" className="btn btn-sm btn-outline-secondary text-light">Ver todos →</Link>
            </div>
            <div className="row g-3">
              {recommendedCourses.map((c) => {
                const instrutorName = usuarios.find((u) => u.idUsuario === c.idInstrutor)?.nome || 'Instrutor';
                const isEmBreve = !c.bannerUrl;
                return (
                  <div className="col-md-4" key={c.idCurso}>
                    <div
                      className={`card bg-black text-white h-100 shadow-sm d-flex flex-column justify-content-between position-relative ${
                        isEmBreve ? '' : 'hover-card'
                      }`}
                      onClick={(e) => {
                        if (isEmBreve) return;
                        if ((e.target as HTMLElement).closest('button, a')) {
                          return;
                        }
                        navigate(`/course/${c.idCurso}`);
                      }}
                      style={{
                        border: isEmBreve ? '2px dashed rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.15)',
                        opacity: isEmBreve ? 0.45 : 1,
                        filter: isEmBreve ? 'grayscale(100%)' : 'none',
                        cursor: isEmBreve ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isEmBreve && (
                        <div
                          className="position-absolute top-0 end-0 m-2 px-2 py-0.5 rounded bg-dark bg-opacity-75 border border-secondary border-opacity-50 d-flex align-items-center gap-1"
                          style={{ zIndex: 2, fontSize: '9px', backdropFilter: 'blur(4px)' }}
                        >
                          <LockIcon size={10} className="text-secondary" />
                          <span className="text-muted fw-bold" style={{ letterSpacing: '0.05em' }}>EM BREVE</span>
                        </div>
                      )}

                      <div className="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                          {c.bannerUrl ? (
                            <img
                              src={c.bannerUrl}
                              alt={c.titulo}
                              className="w-100 rounded mb-3"
                              style={{
                                aspectRatio: '16 / 9',
                                border: '1px solid rgba(255,255,255,0.05)',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <div
                              className="w-100 rounded mb-3 d-flex flex-column align-items-center justify-content-center text-muted"
                              style={{
                                aspectRatio: '16 / 9',
                                background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.1) 100%)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                fontSize: '13px',
                                letterSpacing: '0.05em',
                              }}
                            >
                              <LockIcon size={20} className="mb-1 text-muted" style={{ opacity: 0.6 }} />
                              <span>Em breve...</span>
                            </div>
                          )}
                          <h6 className="fw-bold text-light mb-1 text-truncate-2" style={{ height: '38px', overflow: 'hidden' }}>
                            {c.titulo}
                          </h6>
                          <p className="text-muted small mb-2">{instrutorName}</p>
                        </div>

                        <div className="pt-2 border-top border-secondary d-flex justify-content-between align-items-center mt-3">
                          <span className="text-capitalize text-muted small" style={{ fontSize: '11px' }}>
                            {c.nivel}
                          </span>
                          <span className="small text-warning d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                            <StarIcon size={12} fill="#ffc107" /> 4.9
                          </span>
                        </div>
                        
                        {currentUser.perfil === 'administrador' ? (
                          <button
                            onClick={() => navigate(`/admin?tab=courses&edit=${c.idCurso}`)}
                            className="btn btn-sm btn-primary w-100 mt-3 fw-semibold"
                          >
                            Editar Curso
                          </button>
                        ) : isEmBreve ? (
                          <button
                            disabled
                            className="btn btn-sm btn-secondary w-100 mt-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                            style={{ cursor: 'not-allowed' }}
                          >
                            <LockIcon size={12} /> Em breve
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/course/${c.idCurso}`)}
                            className="btn btn-sm btn-outline-secondary w-100 text-light mt-3 fw-semibold"
                          >
                            Ver Detalhes
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado Direito: Métricas Gerais & Atividade */}
        <div className="col-lg-4">
          <div className="card bg-black border border-secondary text-white p-3 mb-4 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Métricas Gerais</h5>
            
            {/* Overall Progress */}
            <div className="mb-4">
              <span className="text-muted small d-block mb-1">Média de Conclusão</span>
              <div className="d-flex align-items-baseline gap-2">
                <span className="fs-2 fw-bold text-primary">
                  {activeEnrollments.length > 0
                    ? Math.round(activeEnrollments.reduce((sum, e) => sum + e.progresso, 0) / activeEnrollments.length)
                    : 0}
                  %
                </span>
                <span className="text-muted small">das matrículas</span>
              </div>
              <div className="progress bg-dark mt-2" style={{ height: '6px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{
                    width: `${
                      activeEnrollments.length > 0
                        ? Math.round(activeEnrollments.reduce((sum, e) => sum + e.progresso, 0) / activeEnrollments.length)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Quick Metrics Cards Grid */}
            <div className="row g-2 text-center">
              <div className="col-4">
                <div className="bg-secondary bg-opacity-10 border border-secondary rounded p-2">
                  <span className="fs-5 fw-bold text-light d-block">{userMatriculas.length}</span>
                  <span className="text-muted small" style={{ fontSize: '10px' }}>Inscritos</span>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-secondary bg-opacity-10 border border-secondary rounded p-2">
                  <span className="fs-5 fw-bold text-success d-block">{totalCompletedCursos}</span>
                  <span className="text-muted small" style={{ fontSize: '10px' }}>Concluídos</span>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-secondary bg-opacity-10 border border-secondary rounded p-2">
                  <span className="fs-5 fw-bold text-warning d-block">{userCertificadosCount}</span>
                  <span className="text-muted small" style={{ fontSize: '10px' }}>Diplomas</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Novidades</h5>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
              <li className="d-flex gap-2 align-items-start border-bottom border-secondary border-opacity-25 pb-2">
                <span className="text-primary small fw-bold mt-1">[Novo]</span>
                <div>
                  <span className="fw-semibold d-block small" style={{ fontSize: '13px' }}>Nova Trilha Disponível</span>
                  <span className="text-muted small" style={{ fontSize: '11px' }}>Explore a trilha "Full Stack JavaScript" na aba Trilhas.</span>
                </div>
              </li>
              <li className="d-flex gap-2 align-items-start border-bottom border-secondary border-opacity-25 pb-2">
                <span className="text-success small fw-bold mt-1">[Info]</span>
                <div>
                  <span className="fw-semibold d-block small" style={{ fontSize: '13px' }}>Sistema de Certificados</span>
                  <span className="text-muted small" style={{ fontSize: '11px' }}>Complete 100% de qualquer curso para emitir seu diploma digital instantâneo.</span>
                </div>
              </li>
              <li className="d-flex gap-2 align-items-start">
                <span className="text-warning small fw-bold mt-1">[Pro]</span>
                <div>
                  <span className="fw-semibold d-block small" style={{ fontSize: '13px' }}>Módulo Premium Pro</span>
                  <span className="text-muted small" style={{ fontSize: '11px' }}>Assine o Plano Pro e libere acesso completo a trilhas com suporte.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
