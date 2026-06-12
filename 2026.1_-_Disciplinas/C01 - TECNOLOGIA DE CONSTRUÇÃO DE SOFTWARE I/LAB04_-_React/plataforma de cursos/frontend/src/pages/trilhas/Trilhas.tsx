import { Link } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { LockIcon } from '../../components/ui/Icons';

export default function Trilhas() {
  const { trilhas, trilhasCursos, cursos, categorias, usuarios, modulos, aulas } = useApp();

  // Helper to fetch courses of a specific trail
  const getCoursesForTrilha = (trilhaId: string) => {
    return trilhasCursos
      .filter((tc) => tc.idTrilha === trilhaId)
      .sort((a, b) => a.ordem - b.ordem)
      .map((tc) => cursos.find((c) => c.idCurso === tc.idCurso))
      .filter(Boolean) as any[];
  };

  const getLessonsCountForCourse = (courseId: string) => {
    const courseModules = modulos.filter((m) => m.idCurso === courseId).map((m) => m.idModulo);
    return aulas.filter((a) => courseModules.includes(a.idModulo)).length;
  };

  return (
    <div className="container-fluid py-2">
      {/* Title */}
      <div className="mb-4">
        <h2 className="fw-bold text-light mb-1">Trilhas de Aprendizado</h2>
        <p className="text-muted">Caminhos sequenciais estruturados por especialistas para você dominar uma tecnologia do zero.</p>
      </div>

      {/* Trilhas List */}
      {trilhas.length === 0 ? (
        <div className="card border-secondary bg-black bg-opacity-25 text-white p-5 text-center shadow-sm">
          <h4 className="fw-semibold">Nenhuma trilha disponível</h4>
          <p className="text-muted">As trilhas serão configuradas no painel de administração.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {trilhas.map((trilha) => {
            const trCourses = getCoursesForTrilha(trilha.idTrilha);
            const totalHours = trCourses.reduce((sum, c) => sum + (c.totalHoras || 0), 0);
            const totalLessons = trCourses.reduce((sum, c) => sum + getLessonsCountForCourse(c.idCurso), 0);
            const categoryObj = categorias.find((cat) => cat.idCategoria === trilha.idCategoria);

            return (
              <div className="card bg-black border border-secondary text-white p-4 shadow-sm" key={trilha.idTrilha}>
                {/* Header Trail Details */}
                <div className="d-flex justify-content-between align-items-start border-bottom border-secondary pb-3 mb-4 flex-wrap gap-3">
                  <div>
                    <span className="badge bg-primary px-3 py-1.5 rounded-pill mb-2 text-uppercase fw-semibold" style={{ fontSize: '9px' }}>
                      {categoryObj?.nome || 'Tecnologia'}
                    </span>
                    <h3 className="fw-bold text-light mb-2">{trilha.titulo}</h3>
                    <p className="text-muted mb-0 small" style={{ maxWidth: '750px', lineHeight: '1.5' }}>
                      {trilha.descricao}
                    </p>
                  </div>

                  {/* Metadata Stats Badge Box */}
                  <div className="d-flex gap-3 bg-secondary bg-opacity-10 border border-secondary rounded p-3 text-center align-self-sm-center">
                    <div>
                      <span className="text-muted small d-block" style={{ fontSize: '9px', textTransform: 'uppercase' }}>Cursos</span>
                      <strong className="text-light fs-5">{trCourses.length}</strong>
                    </div>
                    <div className="vr bg-secondary"></div>
                    <div>
                      <span className="text-muted small d-block" style={{ fontSize: '9px', textTransform: 'uppercase' }}>Aulas</span>
                      <strong className="text-light fs-5">{totalLessons}</strong>
                    </div>
                    <div className="vr bg-secondary"></div>
                    <div>
                      <span className="text-muted small d-block" style={{ fontSize: '9px', textTransform: 'uppercase' }}>Horas</span>
                      <strong className="text-primary fs-5">{totalHours}h</strong>
                    </div>
                  </div>
                </div>

                {/* Courses in Trail */}
                <div>
                  <h6 className="text-uppercase text-muted fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    Sequência Recomendada de Estudos
                  </h6>

                  {trCourses.length === 0 ? (
                    <div className="text-muted small py-2">Nenhum curso vinculado a esta trilha ainda.</div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {trCourses.map((c, index) => {
                        const instructorName = usuarios.find((u) => u.idUsuario === c.idInstrutor)?.nome || 'Instrutor';
                        const numAulas = getLessonsCountForCourse(c.idCurso);
                        const isEmBreve = !c.bannerUrl;
                        return (
                          <div
                            key={c.idCurso}
                            className="p-3 bg-secondary bg-opacity-5 border rounded d-flex justify-content-between align-items-center flex-column flex-sm-row gap-3"
                            style={{
                              borderStyle: isEmBreve ? 'dashed' : 'solid',
                              borderColor: isEmBreve ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.15)',
                              borderWidth: isEmBreve ? '2px' : '1px',
                              opacity: isEmBreve ? 0.45 : 1,
                              filter: isEmBreve ? 'grayscale(100%)' : 'none',
                              cursor: isEmBreve ? 'not-allowed' : 'default',
                            }}
                          >
                            <div className="d-flex align-items-center gap-3 w-100">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fw-bold flex-shrink-0"
                                style={{ width: '32px', height: '32px', fontSize: '13px' }}
                              >
                                {index + 1}
                              </div>
                              <div className="text-truncate">
                                <h6 className="fw-bold text-light mb-1 text-truncate d-flex align-items-center gap-2">
                                  {c.titulo}
                                  {isEmBreve && (
                                    <span className="badge bg-secondary text-uppercase" style={{ fontSize: '8px', opacity: 0.8 }}>
                                      Em breve
                                    </span>
                                  )}
                                </h6>
                                <span className="text-muted small">
                                  por {instructorName} • {numAulas} aulas • Nível {c.nivel}
                                </span>
                              </div>
                            </div>

                            <div className="d-flex align-items-center gap-3 justify-content-between w-100 w-sm-auto flex-shrink-0">
                              <span className="text-muted small fw-semibold">{c.totalHoras}h</span>
                              {isEmBreve ? (
                                <button
                                  disabled
                                  className="btn btn-sm btn-secondary fw-semibold px-3 text-nowrap d-flex align-items-center gap-1"
                                  style={{ cursor: 'not-allowed' }}
                                >
                                  <LockIcon size={12} /> Em breve
                                </button>
                              ) : (
                                <Link to={`/course/${c.idCurso}`} className="btn btn-sm btn-outline-primary fw-semibold px-3 text-nowrap">
                                  Ver Curso
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
