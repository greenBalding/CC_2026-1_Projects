import { useState }         from 'react';
import { useNavigate }      from 'react-router-dom';
import { useApp }           from '../../hooks/useApp';
import { api }              from '../../services/api';
import { BookOpen, Trophy } from 'lucide-react';

export default function Cursos() {
  const { currentUser, cursos, matriculas, certificados, usuarios, modulos, aulas, progressoAulas, avaliacoes, refreshData, showAlert, showConfirm } = useApp();
  const navigate = useNavigate();
  const [loadingUnenroll, setLoadingUnenroll] = useState<string | null>(null);

  const handleUnenroll = async (enrollId: string) => {
    showConfirm(
      'Tem certeza de que deseja cancelar sua matrícula neste curso? Todo o seu progresso de aulas será perdido.',
      async () => {
        setLoadingUnenroll(enrollId);
        try {
          await api.deleteMatricula(enrollId);
          await refreshData();
          showAlert('Matrícula cancelada com sucesso.', 'success');
        } catch (err) {
          console.error(err);
          showAlert('Erro ao cancelar matrícula.', 'error');
        } finally {
          setLoadingUnenroll(null);
        }
      }
    );
  };

  if (!currentUser) {
    return (
      <div className="alert alert-warning text-center mt-4" role="alert">
        Nenhum usuário logado. Por favor, selecione um usuário na barra superior.
      </div>
    );
  }

  // Obtém os cursos matriculados com progresso
  const userMatriculas = matriculas.filter((m) => m.idUsuario === currentUser.idUsuario);
  
  const getProgressInfo = (idCurso: string) => {
    const courseModules = modulos.filter((m) => m.idCurso === idCurso).map((m) => m.idModulo);
    const courseLessons = aulas.filter((a) => courseModules.includes(a.idModulo));
    const courseLessonsIds = courseLessons.map((a) => a.idAula);
    const completed = progressoAulas.filter(
      (p) => p.idUsuario === currentUser.idUsuario && courseLessonsIds.includes(p.idAula) && p.status === 'CONCLUIDO'
    );
    return {
      percentage: courseLessons.length > 0 ? Math.round((completed.length / courseLessons.length) * 100) : 0,
    };
  };

  const activeEnrollments = userMatriculas.map((mat) => {
    const cursoObj = cursos.find((c) => c.idCurso === mat.idCurso);
    const progressVal = cursoObj ? getProgressInfo(cursoObj.idCurso).percentage : 0;
    return {
      ...mat,
      curso: cursoObj,
      progresso: progressVal,
    };
  });

  const completedCertificates = certificados.filter((c) => c.idUsuario === currentUser.idUsuario);

  return (
    <div className="container-fluid py-2">
      {/* Title */}
      <div className="mb-4">
        <h2 className="fw-bold text-light mb-1">Meus Cursos</h2>
        <p className="text-muted">Acompanhe seu progresso nas aulas e baixe seus diplomas de conclusão.</p>
      </div>

      {/* Em Andamento */}
      <div className="mb-5">
        <h4 className="fw-bold text-light mb-3 d-flex align-items-center gap-2">
          <BookOpen size={20} className="text-primary" /> Cursos em Andamento
        </h4>
        
        {activeEnrollments.length === 0 ? (
          <div className="card bg-black border border-secondary text-white p-4 text-center shadow-sm">
            <span className="text-muted small">Você não está estudando nenhum curso no momento.</span>
          </div>
        ) : (
          <div className="row g-3">
            {activeEnrollments.map((mat) => {
              const c = mat.curso;
              if (!c) return null;
              const instrutorName = usuarios.find((u) => u.idUsuario === c.idInstrutor)?.nome || 'Instrutor';

              const courseEvals = avaliacoes.filter((e) => e.idCurso === c.idCurso);
              const hasEvals = courseEvals.length > 0;
              const avgRating = hasEvals
                ? (courseEvals.reduce((sum, e) => sum + Number(e.nota), 0) / courseEvals.length).toFixed(1)
                : null;

              return (
                <div className="col-md-6 col-lg-4" key={mat.idMatricula}>
                  <div
                    className="card bg-black border border-secondary text-white h-100 shadow-sm hover-card overflow-hidden d-flex flex-column justify-content-between"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button, a')) {
                        return;
                      }
                      navigate(`/player/${c.idCurso}`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
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
                      <div className="p-4">
                        <span className="badge bg-secondary text-uppercase fw-semibold mb-2" style={{ fontSize: '10px', letterSpacing: '0.03em' }}>
                          {c.nivel}
                        </span>
                        <h5 className="fw-bold text-light mb-2" style={{ fontSize: '1.2rem', lineHeight: '1.3' }}>{c.titulo}</h5>

                        {/* Course Rating */}
                        <div className="d-flex align-items-center gap-1 mb-2" style={{ fontSize: '13.5px' }}>
                          {hasEvals ? (
                            <>
                              <span className="text-warning">★</span>
                              <span className="fw-semibold text-warning">{avgRating}</span>
                              <span className="text-muted">({courseEvals.length})</span>
                            </>
                          ) : (
                            <>
                              <span className="text-muted">★</span>
                              <span className="text-muted" style={{ fontSize: '12.5px' }}>Sem avaliações</span>
                            </>
                          )}
                        </div>

                        <p className="text-muted mb-0" style={{ fontSize: '13.5px' }}>por {instrutorName}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 mt-3 border-top border-secondary border-opacity-25 pt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small">Progresso</span>
                        <span className="fw-bold text-primary small">{mat.progresso}%</span>
                      </div>
                      <div className="progress bg-dark mb-4" style={{ height: '6px' }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${mat.progresso}%` }}
                          aria-valuenow={mat.progresso}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>

                      <div className="d-flex justify-content-between align-items-center gap-2">
                        <button
                          onClick={() => navigate(`/player/${c.idCurso}`)}
                          className="btn btn-sm btn-primary px-3 fw-semibold"
                        >
                          Continuar
                        </button>
                        <button
                          onClick={() => navigate(`/course/${c.idCurso}`)}
                          className="btn btn-sm btn-outline-secondary text-light fw-semibold"
                        >
                          Detalhes
                        </button>
                        <button
                          onClick={() => handleUnenroll(mat.id || mat.idMatricula)}
                          disabled={loadingUnenroll === (mat.id || mat.idMatricula)}
                          className="btn btn-sm btn-outline-danger fw-semibold"
                        >
                          {loadingUnenroll === (mat.id || mat.idMatricula) ? 'Saindo...' : 'Desmatricular'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificados Concluídos */}
      <div>
        <h4 className="fw-bold text-light mb-3 d-flex align-items-center gap-2">
          <Trophy size={20} className="text-warning" /> Certificados Conquistados
        </h4>

        {completedCertificates.length === 0 ? (
          <div className="card bg-black border border-secondary text-white p-4 text-center shadow-sm">
            <span className="text-muted small">Complete 100% de um curso para liberar seu certificado digital.</span>
          </div>
        ) : (
          <div className="row g-3">
            {completedCertificates.map((cert) => {
              const cursoObj = cursos.find((c) => c.idCurso === cert.idCurso);
              return (
                <div className="col-md-6 col-lg-4" key={cert.idCertificado}>
                  <div className="card bg-black border border-success text-white h-100 shadow-sm hover-card d-flex flex-column justify-content-between" style={{ borderLeftWidth: '4px' }}>
                    <div className="p-4">
                      <span className="badge bg-success text-uppercase mb-2" style={{ fontSize: '8px' }}>
                        Certificado Emitido
                      </span>
                      <h5 className="fw-bold text-light mb-2">{cursoObj ? cursoObj.titulo : 'Curso Concluído'}</h5>
                      <p className="text-muted small mb-0" style={{ fontSize: '11px' }}>
                        Código: <code className="text-light">{cert.codigoVerificacao}</code>
                      </p>
                    </div>

                    <div className="p-4 pt-0 mt-3 border-top border-secondary border-opacity-25 pt-3 d-flex justify-content-between align-items-center">
                      <span className="text-muted small" style={{ fontSize: '11px' }}>
                        Emitido em: {new Date(cert.dataEmissao).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showAlert(`Código: ${cert.codigoVerificacao}\nData de Emissão: ${new Date(cert.dataEmissao).toLocaleDateString()}`, 'success', 'Certificado Autêntico');
                        }}
                        className="btn btn-sm btn-outline-success fw-semibold"
                      >
                        Visualizar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
