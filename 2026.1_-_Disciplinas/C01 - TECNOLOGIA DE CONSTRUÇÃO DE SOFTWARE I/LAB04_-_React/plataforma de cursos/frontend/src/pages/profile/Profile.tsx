import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { Crown, Star, Flame, Target, Award, Rocket } from 'lucide-react';

export default function Profile() {
  const { currentUser, certificados, matriculas, pagamentos, assinaturas, planos, cursos, aulas, progressoAulas } = useApp();
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState<any>(null);

  if (!currentUser) {
    return (
      <div className="alert alert-warning text-center mt-4" role="alert">
        Nenhum usuário logado. Por favor, selecione um usuário na barra superior.
      </div>
    );
  }

  // Calculate dynamic study hours from completed lessons
  const completedProgress = progressoAulas.filter(
    (p) => p.idUsuario === currentUser.idUsuario && p.status === 'CONCLUIDO'
  );
  const completedLessonIds = completedProgress.map((p) => p.idAula);
  const completedLessons = aulas.filter((a) => completedLessonIds.includes(a.idAula));
  const totalMinutes = completedLessons.reduce((sum, a) => sum + (a.duracaoMinutos || 0), 0);
  const studyHours = Number((totalMinutes / 60).toFixed(1));

  // Goal calculations
  const weeklyGoalHours = 10;
  const progressPercentage = weeklyGoalHours > 0 ? Math.min(Math.round((studyHours / weeklyGoalHours) * 100), 100) : 0;
  const hoursRemaining = Number(Math.max(weeklyGoalHours - studyHours, 0).toFixed(1));

  // Leaderboard data
  const leaderboardData = [
    { nome: 'Diego Fernandes', horas: 8.5 },
    { nome: 'Mayk Brito', horas: 6.2 },
    { nome: currentUser.nome, horas: studyHours, isSelf: true },
    { nome: 'Ana Souza', horas: 3.0 },
    { nome: 'Felipe Deschamps', horas: 1.5 },
  ].sort((a, b) => b.horas - a.horas);


  const userCertificates = certificados.filter((c) => c.idUsuario === currentUser.idUsuario);
  const userMatriculasCount = matriculas.filter((m) => m.idUsuario === currentUser.idUsuario).length;
  const userPayments = pagamentos.filter((p) => p.idUsuario === currentUser.idUsuario);

  const userSubs = assinaturas.filter((s) => s.idUsuario === currentUser.idUsuario);
  const activeSubscription = userSubs.length > 0 ? userSubs[userSubs.length - 1] : null;

  const activePlan = activeSubscription
    ? planos.find((p) => p.idPlano === activeSubscription.idPlano)
    : null;

  const isPro = activePlan ? (activePlan.idPlano === 'plan2' || activePlan.idPlano === 'plan3') : false;

  const achievements = [
    {
      icon: <Crown size={30} style={{ color: isPro ? '#ffc107' : '#6c757d' }} />,
      name: isPro ? (activePlan ? activePlan.nome : 'Pro') : 'Básico',
      description: isPro ? 'Assinatura Ativa' : 'Assinatura Inativa',
    },
    { icon: <Star size={30} fill="#7c3aed" style={{ color: '#7c3aed' }} />, name: 'Top Student', description: 'Top 1% da semana' },
    { icon: <Flame size={30} style={{ color: '#dc3545' }} />, name: 'On Fire', description: '7 dias de streak' },
    { icon: <Target size={30} style={{ color: '#0dcaf0' }} />, name: 'Objetivo', description: 'Primeira meta batida' },
    { icon: <Award size={30} style={{ color: '#198754' }} />, name: 'Perfeição', description: 'Nota 10 em 3 quizzes' },
    { icon: <Rocket size={30} style={{ color: '#d63384' }} />, name: 'Speedrun', description: 'Concluiu em < 3 dias' },
  ];

  return (
    <div className="container-fluid py-2">
      {/* Profile Header */}
      <div className="card bg-black border border-secondary text-white p-4 mb-4 shadow-sm">
        <div className="d-flex align-items-center gap-3 flex-column flex-sm-row text-center text-sm-start">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-primary shadow"
            style={{ width: '80px', height: '80px', fontSize: '30px' }}
          >
            {currentUser.nome.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h1 className="fw-bold text-light mb-1">{currentUser.nome}</h1>
            <p className="text-muted mb-2">{currentUser.email}</p>
            <div className="d-flex gap-2 flex-wrap mt-2 justify-content-center justify-content-sm-start">
              <span className="badge bg-primary px-3 py-2 text-uppercase fw-semibold" style={{ fontSize: '10px' }}>
                Conta {currentUser.perfil}
              </span>
              <span className={`badge ${isPro ? 'bg-warning text-dark' : 'bg-secondary'} px-3 py-2 text-uppercase fw-semibold`} style={{ fontSize: '10px' }}>
                Plano: {activePlan ? activePlan.nome : 'Grátis'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side: Stats & Badges */}
        <div className="col-lg-8">
          {/* Stats Cards */}
          <div className="mb-4">
            <h5 className="fw-bold text-light mb-3">Minhas Estatísticas</h5>
            <div className="row g-3">
              <div className="col-sm-4">
                <div className="card bg-black border border-secondary text-white p-3 text-center shadow-sm">
                  <span className="text-muted small d-block mb-1">Horas de Estudo</span>
                  <span className="fs-3 fw-bold text-primary">{studyHours}h</span>
                  <span className="text-muted small mt-1" style={{ fontSize: '10px' }}>tempo total</span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card bg-black border border-secondary text-white p-3 text-center shadow-sm">
                  <span className="text-muted small d-block mb-1">Certificados</span>
                  <span className="fs-3 fw-bold text-success">{userCertificates.length}</span>
                  <span className="text-muted small mt-1" style={{ fontSize: '10px' }}>Salvos no perfil</span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card bg-black border border-secondary text-white p-3 text-center shadow-sm">
                  <span className="text-muted small d-block mb-1">Cursos Ativos</span>
                  <span className="fs-3 fw-bold text-warning">{userMatriculasCount}</span>
                  <span className="text-muted small mt-1" style={{ fontSize: '10px' }}>Em andamento</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges achievements */}
          <div className="mb-4">
            <h5 className="fw-bold text-light mb-3">Conquistas Desbloqueadas</h5>
            <div className="row g-3">
              {achievements.map((ach) => (
                <div className="col-6 col-sm-4 col-md-3" key={ach.name}>
                  <div className="card bg-black border border-secondary text-white p-3 text-center h-100 shadow-sm hover-card">
                    <div className="mb-2 d-flex justify-content-center align-items-center" style={{ height: '40px' }}>
                      {ach.icon}
                    </div>
                    <strong className="text-light small d-block mb-1">{ach.name}</strong>
                    <span className="text-muted" style={{ fontSize: '10px' }}>{ach.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Módulo de Certificados */}
          <div className="mb-4">
            <h5 className="fw-bold text-light mb-3">Meus Certificados</h5>
            <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
              {userCertificates.length === 0 ? (
                <div className="text-center text-muted py-4 small">Você ainda não concluiu nenhum curso para gerar certificados.</div>
              ) : (
                <div className="row g-3">
                  {userCertificates.map((cert) => {
                    const courseObj = cursos.find((c) => c.idCurso === cert.idCurso);
                    return (
                      <div className="col-md-6" key={cert.idCertificado}>
                        <div className="card bg-secondary bg-opacity-10 border-secondary text-white p-3 h-100 d-flex flex-column justify-content-between">
                          <div>
                            <h6 className="fw-bold text-primary mb-1">{courseObj?.titulo || 'Curso'}</h6>
                            <p className="text-muted small mb-2">Concluído em: {new Date(cert.dataEmissao).toLocaleDateString()}</p>
                            <span className="text-muted font-monospace" style={{ fontSize: '10px' }}>Ref: {cert.codigoVerificacao}</span>
                          </div>
                          <button
                            onClick={() => setSelectedCert(cert)}
                            className="btn btn-outline-primary btn-sm fw-semibold w-100 mt-3"
                          >
                            Visualizar Diploma
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Módulo Financeiro: Histórico de Pagamentos */}
          <div>
            <h5 className="fw-bold text-light mb-3">Histórico de Transações</h5>
            <div className="card bg-black border border-secondary text-white p-3 shadow-sm overflow-hidden">
              {userPayments.length === 0 ? (
                <div className="text-center text-muted py-4 small">Nenhum pagamento registrado nesta conta.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-striped table-hover mb-0 align-middle" style={{ fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted">ID da Transação</th>
                        <th className="border-secondary text-muted">Método</th>
                        <th className="border-secondary text-muted">Data</th>
                        <th className="border-secondary text-muted text-end">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userPayments.map((p) => (
                        <tr key={p.idPagamento}>
                          <td className="border-secondary fw-semibold text-light">{p.transacaoId}</td>
                          <td className="border-secondary text-capitalize text-muted">{p.metodoPagamento}</td>
                          <td className="border-secondary text-muted">{new Date(p.dataPagamento).toLocaleDateString()}</td>
                          <td className="border-secondary text-success fw-bold text-end">R$ {p.valor.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Goals & Metrics */}
        <div className="col-lg-4">
          {/* Módulo de Assinatura Ativa */}
          <div className="card bg-black border border-secondary text-white p-3 mb-4 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Assinatura Ativa</h5>
            {activePlan ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Plano</span>
                  <span className={`badge ${isPro ? 'bg-warning text-dark' : 'bg-secondary'} fw-semibold`}>
                    {activePlan.nome}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Início</span>
                  <span className="text-light small">{activeSubscription?.dataInicio}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Expira em</span>
                  <span className="text-light small">{activeSubscription?.dataFim}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <span className="text-muted small d-block mb-3">Nenhuma assinatura ativa</span>
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn btn-sm btn-primary w-100 fw-semibold"
                >
                  Ver Planos Disponíveis
                </button>
              </div>
            )}
          </div>

          <div className="card bg-black border border-secondary text-white p-3 mb-4 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Meta Diária</h5>
            <span className="text-muted small d-block mb-2">Progresso do objetivo semanal</span>
            <div className="d-flex justify-content-between align-items-baseline mb-2">
              <span className="fs-3 fw-bold text-primary">{studyHours}h / {weeklyGoalHours}h</span>
              <span className="text-muted small">{progressPercentage}% concluído</span>
            </div>
            <div className="progress bg-dark mb-2" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="text-muted" style={{ fontSize: '11px' }}>
              {hoursRemaining > 0 
                ? `Faltam ${hoursRemaining} horas para atingir seu objetivo semanal. Mantenha o foco!` 
                : 'Parabéns! Você atingiu sua meta semanal! 🚀'}
            </span>
          </div>

          <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Leaderboard</h5>
            {leaderboardData.map((userRow, index) => {
              const rank = index + 1;
              const isUserSelf = userRow.isSelf;
              return (
                <div key={userRow.nome} className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                  <div className="d-flex align-items-center gap-2">
                    <span className={`fw-bold ${rank === 1 ? 'text-warning' : rank === 2 ? 'text-light' : 'text-muted'}`}>
                      #{rank}
                    </span>
                    <span className={`small ${isUserSelf ? 'text-primary fw-bold' : ''}`}>
                      {userRow.nome} {isUserSelf && '(Você)'}
                    </span>
                  </div>
                  <span className="badge bg-secondary">{userRow.horas}h</span>
                </div>
              );
            })}
            <div className="text-center mt-2">
              <span className="text-muted" style={{ fontSize: '11px' }}>Você está disputando a liga semanal com outros estudantes!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Certificate Modal */}
      {selectedCert && (() => {
        const certCourse = cursos.find((c) => c.idCurso === selectedCert.idCurso);
        return (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1050 }} role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content bg-black border border-warning border-opacity-50 text-white shadow-lg position-relative">
                
                {/* Gold Border Ornament */}
                <div style={{ position: 'absolute', inset: '15px', border: '2px solid rgba(255, 193, 7, 0.3)', pointerEvents: 'none', borderRadius: '4px' }}></div>
                
                <div className="modal-header border-0 pb-0 justify-content-end" style={{ zIndex: 10 }}>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedCert(null)} aria-label="Close"></button>
                </div>
                
                <div className="modal-body text-center px-5 py-4" style={{ zIndex: 5 }}>
                  <div className="mb-4">
                    <span className="text-warning fw-bold text-uppercase tracking-widest small d-block mb-2" style={{ letterSpacing: '0.25em' }}>
                      Certificado de Conclusão Acadêmica
                    </span>
                    <h1 className="display-6 fw-bold text-light my-3" style={{ fontFamily: 'Georgia, serif' }}>LearnGPT</h1>
                  </div>

                  <p className="text-muted fst-italic">Certificamos para os devidos fins que o aluno(a)</p>
                  
                  <h3 className="fw-bold text-warning my-3" style={{ fontFamily: 'Georgia, serif' }}>
                    {currentUser.nome}
                  </h3>
                  
                  <p className="text-muted px-4" style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                    concluiu com êxito os requisitos acadêmicos e práticos estabelecidos para o curso de especialização profissional
                  </p>
                  
                  <h4 className="fw-bold text-light my-3">
                    "{certCourse?.titulo || 'Curso Especializado'}"
                  </h4>

                  <p className="text-muted small">
                    emitido em {new Date(selectedCert.dataEmissao).toLocaleDateString()} com carga horária de {certCourse?.totalHoras || 40} horas.
                  </p>

                  {/* Stamp Fictitious Graphic */}
                  <div className="d-flex justify-content-center my-4">
                    <div className="rounded-circle d-flex flex-column align-items-center justify-content-center border border-warning text-warning" style={{ width: '90px', height: '90px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', transform: 'rotate(-5deg)', boxShadow: '0 0 15px rgba(255,193,7,0.1)' }}>
                      <span className="fw-bold">LearnGPT</span>
                      <hr className="my-1 border-warning w-75" />
                      <span>OFICIAL</span>
                      <span>VERIFICADO</span>
                    </div>
                  </div>

                  {/* Verification code footer */}
                  <div className="bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded p-2 d-inline-block small">
                    <span className="text-muted">Código de Autenticidade: </span>
                    <strong className="text-light font-monospace">{selectedCert.codigoVerificacao}</strong>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0 pb-4 justify-content-center" style={{ zIndex: 10 }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-warning text-dark fw-bold px-4 shadow-sm"
                  >
                    Imprimir / Salvar PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    className="btn btn-secondary px-4"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
