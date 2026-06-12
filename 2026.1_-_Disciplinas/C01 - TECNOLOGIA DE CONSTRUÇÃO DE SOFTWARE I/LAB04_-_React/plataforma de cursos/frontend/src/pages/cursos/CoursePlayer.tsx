import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { api } from '../../services/api';
import { Play, HelpCircle, FileText, Video, Check } from 'lucide-react';

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, cursos, modulos, aulas, progressoAulas, certificados, refreshData, showAlert } = useApp();
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [markingProgress, setMarkingProgress] = useState(false);

  const courseId = id || 'c1';
  const curso = cursos.find((c) => c.idCurso === courseId);

  // Filter modules and lessons for this course
  const courseModules = modulos.filter((m) => m.idCurso === courseId).sort((a, b) => a.ordem - b.ordem);
  const courseModulesIds = courseModules.map((m) => m.idModulo);
  
  // Sort lessons: first by module order, then by lesson order
  const courseLessons = aulas
    .filter((a) => courseModulesIds.includes(a.idModulo))
    .sort((a, b) => {
      const modA = courseModules.find((m) => m.idModulo === a.idModulo);
      const modB = courseModules.find((m) => m.idModulo === b.idModulo);
      const modOrderA = modA ? modA.ordem : 0;
      const modOrderB = modB ? modB.ordem : 0;
      
      if (modOrderA !== modOrderB) {
        return modOrderA - modOrderB;
      }
      return a.ordem - b.ordem;
    });

  const currentIdx = activeLesson ? courseLessons.findIndex((l) => l.idAula === activeLesson.idAula) : -1;
  const prevLesson = currentIdx > 0 ? courseLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx >= 0 && currentIdx < courseLessons.length - 1 ? courseLessons[currentIdx + 1] : null;

  // Set default active lesson on load
  useEffect(() => {
    if (courseLessons.length > 0 && !activeLesson) {
      setActiveLesson(courseLessons[0]);
    }
  }, [courseLessons, activeLesson]);

  if (!currentUser) {
    return (
      <div className="alert alert-warning text-center mt-4" role="alert">
        Nenhum usuário logado. Por favor, selecione um usuário na barra superior.
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="card bg-black border border-secondary text-white p-5 text-center shadow-sm">
        <h2 className="fw-bold mb-3 text-danger">Curso não encontrado</h2>
        <p className="text-muted mb-4">O curso selecionado não existe ou foi removido do banco de dados.</p>
        <Link to="/dashboard" className="btn btn-primary px-4 fw-semibold">
          Voltar ao Início
        </Link>
      </div>
    );
  }

  // Get completed lessons count
  const courseLessonsIds = courseLessons.map((a) => a.idAula);
  const userCompletedLessons = progressoAulas.filter(
    (p) => p.idUsuario === currentUser.idUsuario && courseLessonsIds.includes(p.idAula) && p.status === 'CONCLUIDO'
  );
  
  const completedIds = userCompletedLessons.map((p) => p.idAula);
  const progressPercentage = courseLessons.length > 0 ? Math.round((userCompletedLessons.length / courseLessons.length) * 100) : 0;

  // Check if active lesson is completed
  const isCurrentLessonCompleted = activeLesson ? completedIds.includes(activeLesson.idAula) : false;

  // Check if certificate already exists
  const hasCertificate = certificados.some(
    (c) => c.idUsuario === currentUser.idUsuario && c.idCurso === courseId
  );

  // Toggle complete class status
  const handleToggleComplete = async () => {
    if (!activeLesson) return;
    setMarkingProgress(true);
    try {
      const isCompleting = !isCurrentLessonCompleted;
      const progressRecord = {
        idUsuario: currentUser.idUsuario,
        idAula: activeLesson.idAula,
        status: (isCompleting ? 'CONCLUIDO' : 'NAO_INICIADO') as 'CONCLUIDO' | 'EM_PROGRESO' | 'NAO_INICIADO',
        dataConclusao: isCompleting ? new Date().toISOString().split('T')[0] : null,
      };

      await api.upsertProgressoAula(progressRecord);
      await refreshData();

      // Check if this action completes the course (100% completion)
      const updatedCompletedCount = isCompleting 
        ? userCompletedLessons.length + 1 
        : userCompletedLessons.length - 1;
      
      const isCourseNowCompleted = courseLessons.length > 0 && updatedCompletedCount === courseLessons.length;

      // Generate certificate if completed and doesn't have one yet
      if (isCourseNowCompleted && !hasCertificate) {
        const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newCertificate = {
          idCertificado: `cert-${Date.now()}`,
          idUsuario: currentUser.idUsuario,
          idCurso: courseId,
          idTrilha: null,
          codigoVerificacao: `LEARN-2026-${curso.titulo.substring(0, 3).toUpperCase()}-${hash}`,
          dataEmissao: new Date().toISOString().split('T')[0],
        };
        await api.createCertificado(newCertificate);
        await refreshData();
        showAlert(`Parabéns! Você concluiu 100% do curso "${curso.titulo}". Seu certificado foi gerado com sucesso!`, 'success', 'Parabéns!');
      }
    } catch (err) {
      console.error(err);
      showAlert('Erro ao salvar progresso da aula.', 'error');
    } finally {
      setMarkingProgress(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="text-muted small">Assistindo Curso</span>
          <h2 className="fw-bold text-light mb-0">{curso.titulo}</h2>
        </div>
        <Link to={`/course/${curso.idCurso}`} className="btn btn-outline-secondary text-light btn-sm fw-semibold">
          Detalhes do Curso
        </Link>
      </div>

      <div className="row g-4">
        {/* Left Side: Video Player & Description */}
        <div className="col-lg-8">
          {/* Mock Video Frame */}
          <div className="card bg-black border border-secondary text-white p-4 mb-4 shadow-sm position-relative overflow-hidden">
            <div
              className="w-100 rounded d-flex flex-column align-items-center justify-content-center border border-secondary border-opacity-50"
              style={{
                height: '380px',
                background: 'linear-gradient(135deg, rgba(30,20,50,0.4) 0%, rgba(10,10,10,0.8) 100%)',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
              }}
            >
              {activeLesson ? (
                activeLesson.tipoConteudo === 'texto' && activeLesson.urlConteudo && activeLesson.urlConteudo !== '#' ? (
                  <div className="w-100 h-100 d-flex flex-column p-4" style={{ overflowY: 'auto' }}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <FileText size={24} className="text-info" />
                      <h5 className="fw-bold mb-0 text-light">{activeLesson.titulo}</h5>
                    </div>
                    <p className="text-light" style={{ lineHeight: '1.8', fontSize: '15px' }}>
                      {activeLesson.urlConteudo}
                    </p>
                  </div>
                ) : activeLesson.tipoConteudo === 'quiz' && activeLesson.urlConteudo && activeLesson.urlConteudo !== '#' ? (
                  <div className="w-100 h-100 d-flex flex-column p-4" style={{ overflowY: 'auto' }}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <HelpCircle size={24} className="text-success" />
                      <h5 className="fw-bold mb-0 text-light">{activeLesson.titulo}</h5>
                    </div>
                    <p className="text-light" style={{ lineHeight: '1.8', fontSize: '15px' }}>
                      {activeLesson.urlConteudo}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      {activeLesson.tipoConteudo === 'video' ? (
                        <Play size={64} fill="currentColor" className="text-primary animate-pulse" />
                      ) : activeLesson.tipoConteudo === 'quiz' ? (
                        <HelpCircle size={64} className="text-success" />
                      ) : (
                        <FileText size={64} className="text-info" />
                      )}
                    </div>
                    <h4 className="fw-bold text-center px-4">{activeLesson.titulo}</h4>
                    <span className="text-muted small mt-1">Simulador de reprodutor de mídia ({activeLesson.tipoConteudo})</span>
                  </>
                )
              ) : (
                <h5 className="text-muted">Selecione uma aula para reproduzir</h5>
              )}
            </div>

            {/* Actions Bar under the Video */}
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary border-opacity-25 flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={() => prevLesson && setActiveLesson(prevLesson)}
                  disabled={!prevLesson}
                  className="btn btn-outline-secondary btn-sm fw-semibold text-light"
                >
                  Voltar Aula
                </button>
                <button
                  type="button"
                  onClick={() => nextLesson && setActiveLesson(nextLesson)}
                  disabled={!nextLesson}
                  className="btn btn-outline-secondary btn-sm fw-semibold text-light"
                >
                  Avançar Aula
                </button>
              </div>

              {activeLesson && (
                <button
                  onClick={handleToggleComplete}
                  disabled={markingProgress}
                  className={`btn d-flex align-items-center gap-2 fw-semibold ${
                    isCurrentLessonCompleted ? 'btn-success' : 'btn-outline-success'
                  }`}
                >
                  {markingProgress ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : isCurrentLessonCompleted ? (
                    <>
                      <Check size={16} /> Aula Concluída
                    </>
                  ) : (
                    'Marcar como Concluída'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Progress & Lesson List Accordion */}
        <div className="col-lg-4">
          {/* Progress Card */}
          <div className="card bg-black border border-secondary text-white p-3 mb-4 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Progresso Acadêmico</h5>
            <div className="d-flex justify-content-between align-items-baseline mb-2">
              <span className="fs-3 fw-bold text-primary">{progressPercentage}%</span>
              <span className="text-muted small">
                {userCompletedLessons.length} de {courseLessons.length} aulas
              </span>
            </div>
            <div className="progress bg-dark mb-3" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            {hasCertificate && (
              <div className="alert alert-success border-success bg-success bg-opacity-10 text-success text-center py-2 px-3 mb-0 small fw-bold">
                Certificado disponível no Perfil!
              </div>
            )}
          </div>

          {/* Module List Group */}
          <div className="card bg-black border border-secondary text-white p-3 shadow-sm" style={{ maxHeight: '520px', overflowY: 'auto' }}>
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Aulas do Curso</h5>

            {courseModules.length === 0 ? (
              <div className="text-center text-muted py-4 small">Nenhum módulo cadastrado.</div>
            ) : (
              courseModules.map((mod) => {
                const moduleLessons = courseLessons.filter((l) => l.idModulo === mod.idModulo);
                return (
                  <div key={mod.idModulo} className="mb-4">
                    <h6 className="text-uppercase text-muted fw-bold mb-2 style-title" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                      {mod.titulo}
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      {moduleLessons.map((lesson) => {
                        const isActive = activeLesson?.idAula === lesson.idAula;
                        const isCompleted = completedIds.includes(lesson.idAula);

                        return (
                          <div
                            key={lesson.idAula}
                            onClick={() => setActiveLesson(lesson)}
                            className={`p-2 rounded border cursor-pointer d-flex align-items-center justify-content-between transition-all ${
                              isActive
                                ? 'bg-primary bg-opacity-15 border-primary text-white'
                                : 'bg-secondary bg-opacity-5 border-secondary text-light hover-bg-secondary'
                            }`}
                          >
                            <div className="d-flex gap-2 align-items-center text-truncate">
                              {lesson.tipoConteudo === 'video' ? (
                                <Video size={14} className={isActive ? 'text-primary' : 'text-muted'} />
                              ) : lesson.tipoConteudo === 'quiz' ? (
                                <HelpCircle size={14} className={isActive ? 'text-success' : 'text-muted'} />
                              ) : (
                                <FileText size={14} className={isActive ? 'text-info' : 'text-muted'} />
                              )}
                              <span className="small text-truncate" style={{ fontSize: '13px', fontWeight: isActive ? '600' : 'normal' }}>
                                {lesson.titulo}
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-2 flex-shrink-0">
                              <span className="text-muted" style={{ fontSize: '10px' }}>
                                {lesson.duracaoMinutos}m
                              </span>
                              <div
                                className={`rounded-circle d-flex align-items-center justify-content-center`}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  border: '1px solid ' + (isCompleted ? '#10b981' : 'rgba(255,255,255,0.15)'),
                                  background: isCompleted ? '#10b981' : 'transparent',
                                }}
                              >
                                {isCompleted && <Check size={10} className="text-white" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
