import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { api } from '../../services/api';
import { StarIcon, CheckIcon } from '../../components/ui/Icons';
import { useState } from 'react';

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, cursos, modulos, aulas, matriculas, avaliacoes, usuarios, refreshData, showAlert, showConfirm } = useApp();
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  const courseId = id || '';
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
  
  // Calculate average rating
  const courseReviews = avaliacoes.filter((a) => a.idCurso === courseId);
  const averageRating =
    courseReviews.length > 0
      ? courseReviews.reduce((sum, r) => sum + Number(r.nota), 0) / courseReviews.length
      : 4.8; // Default fallback

  const userMatricula = matriculas.find(
    (m) => m.idUsuario === currentUser.idUsuario && m.idCurso === courseId
  );
  const isEnrolled = !!userMatricula;

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const hasEvaluated = courseReviews.some((r) => r.idUsuario === currentUser.idUsuario);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      const reviewRecord = {
        id: `av-${Date.now()}`,
        idAvaliacao: `av-${Date.now()}`,
        idUsuario: currentUser.idUsuario,
        idCurso: courseId,
        nota: String(newRating) as "1" | "2" | "3" | "4" | "5",
        comentario: newComment.trim(),
        dataAvaliacao: new Date().toISOString().split('T')[0],
      };
      await api.createAvaliacao(reviewRecord);
      await refreshData();
      showAlert('Sua avaliação foi enviada com sucesso! Obrigado pelo feedback.', 'success');
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      console.error(err);
      showAlert('Erro ao enviar avaliação.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

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
              <span className="badge bg-primary px-3 py-2 rounded-pill mb-3 text-uppercase fw-bold" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>
                Curso Premium
              </span>
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
              <div className="bg-black bg-opacity-40 rounded border border-secondary p-3">
                <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                  <span className="fs-3 fw-bold text-light">{averageRating.toFixed(1)}</span>
                  <span className="text-warning d-flex align-items-center gap-1">
                    <StarIcon size={16} fill="#ffc107" />
                  </span>
                </div>
                <div className="text-muted small">Média baseada em {courseReviews.length} avaliações</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="row g-4">
        {/* Left main column */}
        <div className="col-lg-8">
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

          {/* Reviews list */}
          <div className="card bg-black border border-secondary text-white p-4 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Avaliações dos Alunos</h5>
            
            {courseReviews.length === 0 ? (
              <div className="text-muted small text-center py-3">Sem avaliações no momento. Comece a assistir para avaliar o curso!</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {courseReviews.map((r) => {
                  const reviewerName = usuarios.find((u) => u.idUsuario === r.idUsuario)?.nome || 'Aluno';
                  return (
                    <div key={r.idAvaliacao} className="border-bottom border-secondary border-opacity-50 pb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong className="text-light small d-block">{reviewerName}</strong>
                          <span className="text-muted" style={{ fontSize: '11px' }}>{r.dataAvaliacao}</span>
                        </div>
                        <div className="text-warning small d-flex align-items-center gap-1">
                          {Array.from({ length: Number(r.nota) }).map((_, idx) => (
                            <StarIcon key={idx} size={14} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted small mb-0">{r.comentario}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {isEnrolled && !hasEvaluated && (
              <form onSubmit={handleReviewSubmit} className="bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded p-3 mt-4">
                <h6 className="fw-bold text-light mb-3">Deixe sua Avaliação</h6>
                <div className="mb-3">
                  <label className="form-label small text-muted mb-1 d-block">Nota (1 a 5 estrelas)</label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="btn btn-sm p-0 border-0"
                      >
                        <StarIcon size={24} style={{ color: star <= newRating ? '#ffc107' : '#6c757d' }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted mb-1">Comentário</label>
                  <textarea
                    rows={3}
                    className="form-control bg-black text-white border-secondary small"
                    required
                    placeholder="Escreva sua opinião sobre o curso..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submittingReview}
                  />
                </div>
                <button type="submit" disabled={submittingReview || !newComment.trim()} className="btn btn-primary btn-sm fw-semibold px-4">
                  {submittingReview ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right sidebar column */}
        <div className="col-lg-4">
          <div className="card bg-black border border-secondary text-white p-3 mb-4 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Detalhes Básicos</h5>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3" style={{ fontSize: '13px' }}>
              <li className="d-flex justify-content-between">
                <span className="text-muted">Acesso:</span>
                <strong className="text-light">Vitalício completo</strong>
              </li>
              <li className="d-flex justify-content-between">
                <span className="text-muted">Suporte:</span>
                <strong className="text-light">Disponível via Fórum</strong>
              </li>
              <li className="d-flex justify-content-between">
                <span className="text-muted">Certificação:</span>
                <strong className="text-light">Inclusa (ao bater 100%)</strong>
              </li>
            </ul>
          </div>

          <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">O que está incluso</h5>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3 text-light" style={{ fontSize: '13px' }}>
              <li className="d-flex align-items-center gap-2">
                <CheckIcon size={14} className="text-success" />
                <span>Vídeos sob demanda em HD</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <CheckIcon size={14} className="text-success" />
                <span>Material de leitura complementar</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <CheckIcon size={14} className="text-success" />
                <span>Exercícios de fixação práticos</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <CheckIcon size={14} className="text-success" />
                <span>Certificado verificado em PDF</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
