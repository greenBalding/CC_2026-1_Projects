import { useApp } from '../../context/AppContext';
import { CrownIcon, StarIcon, FlameIcon, TargetIcon, HundredIcon, RocketIcon } from '../../components/Icons';

export default function Profile() {
  const { currentUser, certificados, matriculas, pagamentos } = useApp();

  if (!currentUser) {
    return (
      <div className="alert alert-warning text-center mt-4" role="alert">
        Nenhum usuário logado. Por favor, selecione um usuário na barra superior.
      </div>
    );
  }

  const userCertificates = certificados.filter((c) => c.idUsuario === currentUser.idUsuario);
  const userMatriculasCount = matriculas.filter((m) => m.idUsuario === currentUser.idUsuario).length;
  const userPayments = pagamentos.filter((p) => p.idUsuario === currentUser.idUsuario);

  const achievements = [
    { icon: <CrownIcon size={30} style={{ color: '#ffc107' }} />, name: 'Pro', description: 'Assinatura Ativa' },
    { icon: <StarIcon size={30} fill="#7c3aed" style={{ color: '#7c3aed' }} />, name: 'Top Student', description: 'Top 1% da semana' },
    { icon: <FlameIcon size={30} style={{ color: '#dc3545' }} />, name: 'On Fire', description: '7 dias de streak' },
    { icon: <TargetIcon size={30} style={{ color: '#0dcaf0' }} />, name: 'Objetivo', description: 'Primeira meta batida' },
    { icon: <HundredIcon size={30} style={{ color: '#198754' }} />, name: 'Perfeição', description: 'Nota 10 em 3 quizzes' },
    { icon: <RocketIcon size={30} style={{ color: '#d63384' }} />, name: 'Speedrun', description: 'Concluiu em < 3 dias' },
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
            <span className="badge bg-primary px-3 py-2 text-uppercase fw-semibold" style={{ fontSize: '10px' }}>
              Conta {currentUser.perfil}
            </span>
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
                  <span className="fs-3 fw-bold text-primary">48h</span>
                  <span className="text-muted small mt-1" style={{ fontSize: '10px' }}>+2h essa semana</span>
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
          <div className="card bg-black border border-secondary text-white p-3 mb-4 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Meta Diária</h5>
            <span className="text-muted small d-block mb-2">Progresso do objetivo semanal</span>
            <div className="d-flex justify-content-between align-items-baseline mb-2">
              <span className="fs-3 fw-bold text-primary">48h / 100h</span>
              <span className="text-muted small">48% concluído</span>
            </div>
            <div className="progress bg-dark mb-2" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: '48%' }}
                aria-valuenow={48}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="text-muted" style={{ fontSize: '11px' }}>Faltam 52 horas para atingir seu objetivo. Mantenha o foco!</span>
          </div>

          <div className="card bg-black border border-secondary text-white p-3 shadow-sm">
            <h5 className="fw-bold border-bottom border-secondary pb-3 mb-3">Leaderboard</h5>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-warning">#42</span>
                <span className="small">{currentUser.nome} (Você)</span>
              </div>
              <span className="badge bg-secondary">48h</span>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-light">#43</span>
                <span className="small">Diego Fernandes</span>
              </div>
              <span className="badge bg-secondary">44h</span>
            </div>
            <div className="text-center">
              <span className="text-muted" style={{ fontSize: '11px' }}>Você está no Top 1% da sua liga semanal!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
