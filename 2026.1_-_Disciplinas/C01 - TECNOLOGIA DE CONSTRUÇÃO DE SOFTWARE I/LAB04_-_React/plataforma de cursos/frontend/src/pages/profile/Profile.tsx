import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';


export default function Profile() {
  const { currentUser, certificados, matriculas, pagamentos, assinaturas, planos, cursos, aulas, progressoAulas, usuarios } = useApp();
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState<any>(null);

  const handleDownloadPDF = () => {
    if (!selectedCert) return;
    const element = document.getElementById('printable-certificate');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `certificado-${selectedCert.codigoVerificacao || 'documento'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#030108',
        logging: false
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    const triggerDownload = () => {
      const html2pdfLib = (window as any).html2pdf;
      if (html2pdfLib) {
        html2pdfLib().from(element).set(opt).save();
      }
    };

    if ((window as any).html2pdf) {
      triggerDownload();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        triggerDownload();
      };
      document.body.appendChild(script);
    }
  };

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



  const userCertificates = certificados.filter((c) => c.idUsuario === currentUser.idUsuario);
  const userMatriculasCount = matriculas.filter((m) => m.idUsuario === currentUser.idUsuario).length;
  const userPayments = pagamentos.filter((p) => p.idUsuario === currentUser.idUsuario);

  const userSubs = assinaturas.filter((s) => s.idUsuario === currentUser.idUsuario);
  const activeSubscription = userSubs.length > 0 ? userSubs[userSubs.length - 1] : null;

  const freePlan = planos.find((p) => p.preco === 0) || null;
  const activePlan = activeSubscription
    ? planos.find((p) => p.idPlano === activeSubscription.idPlano) || freePlan
    : freePlan;

  const isPro = activePlan ? activePlan.preco > 0 : false;


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
                  <span className="text-light small">{activeSubscription ? activeSubscription.dataInicio : 'N/A'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Expira em</span>
                  <span className="text-light small">{activeSubscription ? activeSubscription.dataFim : 'Nunca'}</span>
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



        </div>
      </div>

      {/* Premium Certificate Modal */}
      {selectedCert && (() => {
        const certCourse = cursos.find((c) => c.idCurso === selectedCert.idCurso);
        const instrutorName = certCourse
          ? (usuarios.find((u) => u.idUsuario === certCourse.idInstrutor)?.nome || 'Instrutor Principal')
          : 'Instrutor Principal';

        return (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1050 }} role="dialog">
            {/* Inject dynamic local styling for printing and previewing */}
            <style>{`
              @media print {
                /* Set A4 landscape and remove margins */
                @page {
                  size: landscape;
                  margin: 0;
                }
                
                /* Reset root containers to avoid layout page breaks */
                html, body, #root {
                  margin: 0 !important;
                  padding: 0 !important;
                  height: 100vh !important;
                  overflow: hidden !important;
                  background-color: #030108 !important;
                }

                /* Hide navbars, sidebars, headers, and backgrounds globally */
                nav, .navbar, .no-print, .modal-backdrop {
                  display: none !important;
                }
                
                /* Collapse flex layouts */
                .d-flex {
                  display: block !important;
                }

                main {
                  padding: 0 !important;
                  margin: 0 !important;
                  background: none !important;
                }

                /* Hide all direct child elements of the profile wrapper except the modal */
                .container-fluid > *:not(.modal) {
                  display: none !important;
                }

                /* Expand modal wrappers to full screen height and width */
                .modal {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100vw !important;
                  height: 100vh !important;
                  background: none !important;
                  display: block !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }

                .modal-dialog {
                  max-width: 100% !important;
                  width: 100vw !important;
                  height: 100vh !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }

                .modal-content {
                  background: none !important;
                  border: none !important;
                  box-shadow: none !important;
                  width: 100vw !important;
                  height: 100vh !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }

                .modal-header, .modal-footer {
                  display: none !important;
                }

                .modal-body {
                  padding: 0 !important;
                  margin: 0 !important;
                  width: 100vw !important;
                  height: 100vh !important;
                }

                #printable-certificate {
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100vw !important;
                  height: 100vh !important;
                  margin: 0 !important;
                  padding: 8% !important;
                  box-sizing: border-box !important;
                  display: flex !important;
                  flex-direction: column !important;
                  justify-content: space-between !important;
                  align-items: center !important;
                  background: linear-gradient(135deg, #120924 0%, #030108 100%) !important;
                  border: 20px double #ffc107 !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  z-index: 9999999 !important;
                  border-radius: 0 !important;
                }
              }
              
              /* Screen preview container */
              .certificate-preview-container {
                width: 100%;
                max-width: 820px;
                margin: 0 auto;
                aspect-ratio: 1.414; /* A4 Landscape Aspect Ratio */
                background: linear-gradient(135deg, #120924 0%, #030108 100%);
                border: 10px double rgba(255, 193, 7, 0.45);
                padding: 35px 40px;
                position: relative;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                text-align: center;
                color: #fff;
                border-radius: 8px;
              }
            `}</style>

            <div className="modal-dialog modal-dialog-centered modal-xl no-print">
              <div className="modal-content bg-black border border-secondary text-white shadow-lg position-relative">
                
                <div className="modal-header border-0 pb-0 justify-content-end">
                  <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedCert(null)} aria-label="Close"></button>
                </div>
                
                <div className="modal-body py-4 px-md-5">
                  
                  {/* Visual Preview Container */}
                  <div id="printable-certificate" className="certificate-preview-container">
                    {/* Corner Ornaments */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', width: '22px', height: '22px', borderTop: '2.5px solid #ffc107', borderLeft: '2.5px solid #ffc107' }}></div>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', width: '22px', height: '22px', borderTop: '2.5px solid #ffc107', borderRight: '2.5px solid #ffc107' }}></div>
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '22px', height: '22px', borderBottom: '2.5px solid #ffc107', borderLeft: '2.5px solid #ffc107' }}></div>
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '22px', height: '22px', borderBottom: '2.5px solid #ffc107', borderRight: '2.5px solid #ffc107' }}></div>

                    {/* Logo/Header */}
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-warning fw-bold text-uppercase tracking-widest" style={{ letterSpacing: '0.22em', fontSize: '11px' }}>
                          Certificado de Conclusão Acadêmica
                        </span>
                        <span className="fw-bold text-white fs-5" style={{ letterSpacing: '0.05em', fontFamily: 'Georgia, serif' }}>LearnGPT</span>
                      </div>
                      <hr className="my-2" style={{ borderColor: 'rgba(255, 193, 7, 0.25)' }} />
                    </div>

                    {/* Cert Body */}
                    <div className="my-auto py-2">
                      <p className="text-muted fst-italic mb-1" style={{ fontSize: '13.5px' }}>Certificamos para os devidos fins que o aluno(a)</p>
                      
                      <h2 className="fw-bold text-warning my-2" style={{ fontFamily: 'Georgia, serif', fontSize: '32px', letterSpacing: '0.02em' }}>
                        {currentUser.nome}
                      </h2>
                      
                      <p className="text-muted px-md-4 mx-auto mb-2" style={{ maxWidth: '640px', fontSize: '13.5px', lineHeight: '1.5' }}>
                        concluiu com êxito os requisitos acadêmicos e práticos estabelecidos para o curso de especialização profissional
                      </p>
                      
                      <h3 className="fw-bold text-light my-2" style={{ fontSize: '24px', letterSpacing: '0.01em' }}>
                        "{certCourse?.titulo || 'Curso Especializado'}"
                      </h3>

                      <p className="text-muted small mb-0" style={{ fontSize: '12.5px' }}>
                        emitido em {new Date(selectedCert.dataEmissao).toLocaleDateString()} com carga horária de {certCourse?.totalHoras || 40} horas.
                      </p>
                    </div>

                    {/* Stamp & Signatures row */}
                    <div>
                      <div className="d-flex justify-content-between align-items-center mt-3 px-4">
                        {/* Coordinator Sig */}
                        <div className="text-center" style={{ width: '180px' }}>
                          <div className="border-bottom border-secondary pb-1 mb-1 font-monospace" style={{ fontSize: '12px', color: '#ddd' }}>
                            LearnGPT Team
                          </div>
                          <span className="text-muted small" style={{ fontSize: '9px' }}>Coordenador Geral</span>
                        </div>

                        {/* Seal Graphic */}
                        <div className="rounded-circle d-flex flex-column align-items-center justify-content-center border border-warning text-warning" style={{ width: '75px', height: '75px', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.04em', transform: 'rotate(-5deg)', background: 'rgba(255,193,7,0.02)', boxShadow: '0 0 15px rgba(255,193,7,0.08)' }}>
                          <span className="fw-bold">LearnGPT</span>
                          <hr className="my-1 border-warning w-75" />
                          <span>OFICIAL</span>
                          <span>APROVADO</span>
                        </div>

                        {/* Instructor Sig */}
                        <div className="text-center" style={{ width: '180px' }}>
                          <div className="border-bottom border-secondary pb-1 mb-1 font-monospace" style={{ fontSize: '12px', color: '#ddd' }}>
                            {instrutorName}
                          </div>
                          <span className="text-muted small" style={{ fontSize: '9px' }}>Instrutor do Curso</span>
                        </div>
                      </div>

                      {/* Authenticity code */}
                      <div className="mt-3 text-center">
                        <div className="bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded px-3 py-1 d-inline-block" style={{ fontSize: '10.5px' }}>
                          <span className="text-muted">Chave de Autenticidade: </span>
                          <strong className="text-light font-monospace">{selectedCert.codigoVerificacao}</strong>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="modal-footer border-0 pt-0 pb-4 justify-content-center">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="btn btn-warning text-dark fw-bold px-4 shadow-sm"
                  >
                    Baixar PDF
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
