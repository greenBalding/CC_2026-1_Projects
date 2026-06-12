import { useState }                     from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp }                       from '../../hooks/useApp';
import { api }                          from '../../services/api';


export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseId = id || '';
  const { currentUser, cursos, modulos, aulas, matriculas, usuarios, avaliacoes, refreshData, showAlert, showConfirm } = useApp();
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  // Evaluation States
  const [rating, setRating] = useState<"1" | "2" | "3" | "4" | "5">("5");
  const [comment, setComment] = useState("");
  const [submittingEval, setSubmittingEval] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const evals = avaliacoes.filter((e) => e.idCurso === courseId);
  const myEval = evals.find((e) => e.idUsuario === currentUser?.idUsuario);

  const handleSubmitEval = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingEval(true);
    try {
      if (isEditing && myEval) {
        await api.updateAvaliacao(myEval.idAvaliacao, {
          nota: rating,
          comentario: comment.trim() || null,
        });
        showAlert('Avaliação atualizada com sucesso!', 'success');
        setIsEditing(false);
      } else {
        const generatedId = `ev-${Date.now()}`;
        const newEval = {
          id: generatedId,
          idAvaliacao: generatedId,
          idUsuario: currentUser?.idUsuario || '',
          idCurso: courseId,
          nota: rating,
          comentario: comment.trim() || null,
          dataAvaliacao: new Date().toISOString().split('T')[0],
        };
        await api.createAvaliacao(newEval);
        showAlert('Avaliação enviada com sucesso!', 'success');
      }
      await refreshData();
      setComment("");
      setRating("5");
    } catch (err) {
      console.error(err);
      showAlert('Erro ao processar avaliação.', 'error');
    } finally {
      setSubmittingEval(false);
    }
  };

  const handleDeleteEval = async (idAvaliacao: string) => {
    showConfirm(
      'Tem certeza de que deseja excluir sua avaliação?',
      async () => {
        try {
          await api.deleteAvaliacao(idAvaliacao);
          await refreshData();
          showAlert('Avaliação excluída com sucesso.', 'success');
          setIsEditing(false);
          setComment("");
          setRating("5");
        } catch (err) {
          console.error(err);
          showAlert('Erro ao excluir avaliação.', 'error');
        }
      }
    );
  };

  const renderStars = (nota: string) => {
    const stars = Number(nota);
    return '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
  };
  const curso = cursos.find((c) => c.idCurso === courseId);

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

  const instrutor = usuarios.find((u) => u.idUsuario === curso.idInstrutor);
  const courseModules = modulos.filter((m) => m.idCurso === courseId).sort((a, b) => a.ordem - b.ordem);
  
  const userMatricula = matriculas.find(
    (m) => m.idUsuario === currentUser.idUsuario && m.idCurso === courseId
  );
  const isEnrolled = !!userMatricula;

  const handleEnroll = async () => {
    setLoadingEnroll(true);
    try {
      const newMatricula = {
        idMatricula: `mat-${Date.now()}`,
        idUsuario: currentUser.idUsuario,
        idCurso: courseId,
        dataMatricula: new Date().toISOString().split('T')[0],
        dataConclusao: null,
      };
      await api.createMatricula(newMatricula);
      await refreshData();
      showAlert('Matrícula realizada com sucesso!', 'success');
      navigate(`/player/${courseId}`);
    } catch (err) {
      console.error(err);
      showAlert('Erro ao realizar matrícula.', 'error');
    } finally {
      setLoadingEnroll(false);
    }
  };

  const handleUnenroll = async () => {
    if (!userMatricula) return;
    showConfirm(
      'Tem certeza de que deseja cancelar sua matrícula neste curso? Todo o seu progresso de aulas será perdido.',
      async () => {
        setLoadingEnroll(true);
        try {
          const targetId = userMatricula.id || userMatricula.idMatricula;
          await api.deleteMatricula(targetId);
          await refreshData();
          showAlert('Matrícula cancelada com sucesso.', 'success');
        } catch (err) {
          console.error(err);
          showAlert('Erro ao cancelar matrícula.', 'error');
        } finally {
          setLoadingEnroll(false);
        }
      }
    );
  };

  return (
    <div className="container-fluid py-2">
      {/* Hero Jumbotron Section */}
      <div className="card bg-gradient text-white border border-secondary mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #1e1136 0%, #0d0d0d 100%)' }}>
        <div className="card-body p-4 p-md-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3 text-light">{curso.titulo}</h1>
              <p className="lead text-light mb-4" style={{ opacity: 0.85, fontSize: '16px' }}>
                {curso.descricao}
              </p>
              
              <div className="row g-3 mb-4">
                <div className="col-sm-6 col-md-3">
                  <span className="text-muted small d-block">Duração total</span>
                  <strong className="text-light fs-6">{curso.totalHoras} horas</strong>
                </div>
                <div className="col-sm-6 col-md-3">
                  <span className="text-muted small d-block">Nível de aprendizado</span>
                  <strong className="text-light text-capitalize fs-6">{curso.nivel}</strong>
                </div>
                <div className="col-sm-6 col-md-3">
                  <span className="text-muted small d-block">Quantidade de aulas</span>
                  <strong className="text-light fs-6">{curso.totalAulas} aulas</strong>
                </div>
              </div>

              {currentUser.perfil === 'administrador' ? (
                <button
                  onClick={() => navigate(`/admin?tab=courses&edit=${curso.idCurso}`)}
                  className="btn btn-primary btn-lg px-4 fw-bold"
                >
                  Editar Curso
                </button>
              ) : isEnrolled ? (
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <button
                    onClick={() => navigate(`/player/${curso.idCurso}`)}
                    className="btn btn-primary btn-lg px-4 fw-bold"
                  >
                    Acessar Aulas do Curso
                  </button>
                  <button
                    onClick={handleUnenroll}
                    disabled={loadingEnroll}
                    className="btn btn-outline-danger btn-lg px-4 fw-bold"
                  >
                    {loadingEnroll ? 'Carregando...' : 'Cancelar Matrícula'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={loadingEnroll}
                  className="btn btn-primary btn-lg px-4 fw-bold"
                >
                  {loadingEnroll ? 'Carregando...' : 'Matricular-se Agora'}
                </button>
              )}
            </div>

            <div className="col-lg-4 text-center">
              {curso.bannerUrl ? (
                <img
                  src={curso.bannerUrl}
                  alt={curso.titulo}
                  className="w-100 rounded mb-3 shadow img-fluid"
                  style={{
                    aspectRatio: '16 / 9',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  className="w-100 rounded mb-3 shadow d-flex align-items-center justify-content-center text-muted"
                  style={{
                    aspectRatio: '16 / 9',
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    fontSize: '16px',
                    letterSpacing: '0.05em',
                  }}
                >
                  Em breve...
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="row g-4">
        {/* Left main column */}
        <div className="col-lg-12">
          {/* Instructor Card */}
          <div className="card bg-black border border-secondary text-white p-4 mb-4 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Instrutor</h5>
            {instrutor ? (
              <div className="d-flex gap-3 align-items-start flex-column flex-sm-row">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-primary flex-shrink-0"
                  style={{ width: '60px', height: '60px', fontSize: '20px' }}
                >
                  {instrutor.nome.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h6 className="fw-bold text-light mb-1">{instrutor.nome}</h6>
                  <p className="text-muted small mb-2">{instrutor.email}</p>
                  <p className="text-muted small mb-0" style={{ lineHeight: '1.5' }}>
                    Instrutor especializado e qualificado. Dedicado a guiar alunos através de práticas atualizadas de desenvolvimento do mercado, garantindo um aprendizado focado na resolução de problemas práticos.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-muted small">Nenhum instrutor atribuído a este curso.</div>
            )}
          </div>

          {/* Curriculum Syllabus list */}
          <div className="card bg-black border border-secondary text-white p-4 mb-4 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Grade Curricular</h5>
            
            {courseModules.length === 0 ? (
              <div className="text-muted small text-center py-3">Nenhum módulo ou aula cadastrado ainda.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {courseModules.map((mod) => {
                  const numAulas = aulas.filter((a) => a.idModulo === mod.idModulo).length;
                  return (
                    <div key={mod.idModulo} className="p-3 bg-secondary bg-opacity-10 border border-secondary rounded d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-muted small d-block">Módulo {mod.ordem}</span>
                        <strong className="text-light">{mod.titulo}</strong>
                      </div>
                      <span className="badge bg-secondary">{numAulas} {numAulas === 1 ? 'aula' : 'aulas'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Avaliações Card */}
          <div className="card bg-black border border-secondary text-white p-4 mb-4 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Avaliações do Curso</h5>
            
            {/* Average Rating Banner */}
            {evals.length > 0 && (
              <div className="alert alert-secondary bg-dark border-secondary text-white d-flex align-items-center justify-content-between p-3 mb-4 rounded">
                <div>
                  <span className="text-muted small d-block">Média do Curso</span>
                  <span className="fs-4 fw-bold">
                    {(evals.reduce((sum, e) => sum + Number(e.nota), 0) / evals.length).toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="fs-4 text-warning">
                  {renderStars(Math.round(evals.reduce((sum, e) => sum + Number(e.nota), 0) / evals.length).toString())}
                </div>
              </div>
            )}

            {/* User review form / display */}
            {isEnrolled && currentUser && (
              <div className="p-3 bg-secondary bg-opacity-10 border border-secondary rounded mb-4">
                {myEval && !isEditing ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="text-primary small d-block fw-semibold">Sua Avaliação</span>
                        <span className="fs-5 text-warning">{renderStars(myEval.nota)}</span>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => {
                            setRating(myEval.nota);
                            setComment(myEval.comentario || "");
                            setIsEditing(true);
                          }}
                          className="btn btn-sm btn-outline-primary fw-semibold"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteEval(myEval.idAvaliacao)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                    {myEval.comentario && <p className="text-light small mb-0 mt-2 bg-black bg-opacity-50 p-2 rounded">{myEval.comentario}</p>}
                  </div>
                ) : (
                  <form onSubmit={handleSubmitEval}>
                    <h6 className="fw-semibold text-primary mb-3">
                      {isEditing ? 'Editar sua Avaliação' : 'Avaliar este Curso'}
                    </h6>
                    <div className="row g-2 mb-3">
                      <div className="col-sm-4">
                        <label className="form-label small text-muted mb-1">Nota</label>
                        <select
                          className="form-select form-select-sm bg-dark text-light border-secondary"
                          value={rating}
                          onChange={(e) => setRating(e.target.value as any)}
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (Excelente)</option>
                          <option value="4">⭐⭐⭐⭐ (Muito Bom)</option>
                          <option value="3">⭐⭐⭐ (Bom)</option>
                          <option value="2">⭐⭐ (Regular)</option>
                          <option value="1">⭐ (Ruim)</option>
                        </select>
                      </div>
                      <div className="col-sm-8">
                        <label className="form-label small text-muted mb-1">Comentário (Opcional)</label>
                        <textarea
                          rows={1}
                          className="form-control form-control-sm bg-dark text-light border-secondary"
                          placeholder="Escreva sua opinião..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" disabled={submittingEval} className="btn btn-sm btn-primary fw-semibold px-3">
                        {submittingEval ? 'Enviando...' : isEditing ? 'Salvar Alterações' : 'Enviar Avaliação'}
                      </button>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setComment("");
                            setRating("5");
                          }}
                          className="btn btn-sm btn-outline-secondary fw-semibold px-3"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* All reviews list */}
            {evals.length === 0 ? (
              <div className="text-muted small text-center py-2">Este curso ainda não recebeu avaliações.</div>
            ) : (
              <div className="d-flex flex-column gap-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {evals.map((e) => {
                  const reviewer = usuarios.find((u) => u.idUsuario === e.idUsuario);
                  return (
                    <div key={e.idAvaliacao} className="p-3 border-bottom border-secondary border-opacity-50">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-light small">{reviewer?.nome || 'Estudante'}</span>
                        <span className="text-muted" style={{ fontSize: '11px' }}>{e.dataAvaliacao}</span>
                      </div>
                      <div className="text-warning mb-2" style={{ fontSize: '13px' }}>{renderStars(e.nota)}</div>
                      {e.comentario && <p className="text-muted small mb-0">{e.comentario}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
