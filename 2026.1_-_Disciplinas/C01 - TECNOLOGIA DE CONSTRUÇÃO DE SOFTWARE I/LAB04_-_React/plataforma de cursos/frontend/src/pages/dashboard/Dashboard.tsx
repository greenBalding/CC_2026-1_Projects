import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { Lock } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, cursos, matriculas, progressoAulas, usuarios, modulos, aulas, avaliacoes } = useApp();
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

  // Prioritize showing in-progress courses, fallback to first overall enrollment
  const inProgressEnrollments = activeEnrollments.filter((e) => e.progresso < 100);

  // Prioritize showing in-progress courses, fallback to all enrollments if none in progress
  const displayedEnrollments = inProgressEnrollments.length > 0 ? inProgressEnrollments : activeEnrollments;



  return (
    <div className="container-fluid py-2">

      {/* Grid de Conteúdo Principal e Painel Lateral */}
      <div className="row">
        {/* Lado Esquerdo: Listas de Cursos */}
        <div className="col-lg-12 mb-4">
          {/* Meus Cursos */}
          {displayedEnrollments.length > 0 && (
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-light mb-0">Meus Cursos</h3>
                <Link to="/cursos" className="btn btn-sm btn-outline-secondary text-light">Ver todos →</Link>
              </div>
              <div className="row g-3">
                {displayedEnrollments.slice(0, 2).map((m) => {
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

                const courseEvals = avaliacoes.filter((e) => e.idCurso === c.idCurso);
                const hasEvals = courseEvals.length > 0;
                const avgRating = hasEvals
                  ? (courseEvals.reduce((sum, e) => sum + Number(e.nota), 0) / courseEvals.length).toFixed(1)
                  : null;

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
                           <Lock size={10} className="text-secondary" />
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
                               <Lock size={20} className="mb-1 text-muted" style={{ opacity: 0.6 }} />
                               <span>Em breve...</span>
                            </div>
                          )}
                          
                          <h6 className="fw-bold text-light mb-1 text-truncate-2" style={{ height: '42px', fontSize: '0.98rem', lineHeight: '1.4', overflow: 'hidden' }}>
                            {c.titulo}
                          </h6>

                          {/* Course Rating */}
                          <div className="d-flex align-items-center gap-1 mb-2" style={{ fontSize: '12.5px' }}>
                            {hasEvals ? (
                              <>
                                <span className="text-warning">★</span>
                                <span className="fw-semibold text-warning">{avgRating}</span>
                                <span className="text-muted">({courseEvals.length})</span>
                              </>
                            ) : (
                              <>
                                <span className="text-muted">★</span>
                                <span className="text-muted" style={{ fontSize: '11.5px' }}>Sem avaliações</span>
                              </>
                            )}
                          </div>

                          <p className="text-muted mb-2" style={{ fontSize: '12.5px' }}>{instrutorName}</p>
                        </div>

                        <div className="pt-2 border-top border-secondary d-flex justify-content-between align-items-center mt-3">
                          <span className="text-capitalize text-muted fw-semibold" style={{ fontSize: '12px', letterSpacing: '0.02em' }}>
                            {c.nivel}
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
                             <Lock size={12} /> Em breve
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

      </div>
    </div>
  );
}
