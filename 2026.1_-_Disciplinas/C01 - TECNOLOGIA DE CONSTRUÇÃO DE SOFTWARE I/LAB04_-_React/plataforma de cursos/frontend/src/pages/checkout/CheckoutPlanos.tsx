import { useState, useEffect } from 'react';
import { useApp }              from '../../hooks/useApp';
import { api }                 from '../../services/api';
import { Check, X }            from 'lucide-react';

export default function CheckoutPlanos() {
  const { currentUser, planos, assinaturas, refreshData, showAlert } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'boleto'>('pix');
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1);
  const [processingText, setProcessingText] = useState('Processando dados...');
  const [transacaoId, setTransacaoId] = useState('');

  // Card details form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // PIX fake copy state
  const [copiedPix, setCopiedPix] = useState(false);

  if (!currentUser) {
    return (
      <div className="alert alert-warning text-center mt-4" role="alert">
        Nenhum usuário logado. Por favor, selecione um usuário na barra superior.
      </div>
    );
  }

  const userSubs = assinaturas.filter((s) => s.idUsuario === currentUser.idUsuario);
  const activeSubscription = userSubs.length > 0 ? userSubs[userSubs.length - 1] : null;

  const freePlan = planos.find((p) => p.preco === 0) || null;
  const activePlan = activeSubscription
    ? planos.find((p) => p.idPlano === activeSubscription.idPlano) || freePlan
    : freePlan;

  const handleOpenCheckout = (plan: any) => {
    setSelectedPlan(plan);
    setCheckoutStep(1);
    setPaymentMethod('pix');
  };

  const handleCloseCheckout = () => {
    setSelectedPlan(null);
    setCheckoutStep(1);
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvv('');
    setCopiedPix(false);
  };

  // Simulates processing stages in Step 3
  useEffect(() => {
    if (checkoutStep === 3) {
      const texts = [
        'Enviando transação para o gateway...',
        'Aguardando autorização bancária...',
        'Confirmando transação no banco de dados...',
      ];
      let currentTextIdx = 0;
      setProcessingText(texts[0]);

      const interval = setInterval(() => {
        currentTextIdx += 1;
        if (currentTextIdx < texts.length) {
          setProcessingText(texts[currentTextIdx]);
        }
      }, 9000000); // long interval but we'll complete it in a timeout anyway

      // Trigger completion simulation
      const timeout = setTimeout(async () => {
        try {
          const today = new Date();
          const endDate = new Date();
          endDate.setMonth(today.getMonth() + selectedPlan.duracaoMeses);

          const subId = `sub-${Date.now()}`;
          const generatedTxId = `tx-${Math.floor(Math.random() * 900000000) + 100000000}`;
          setTransacaoId(generatedTxId);

          // 1. Create Assinatura Record
          const newSubscription = {
            id: subId,
            idAssinatura: subId,
            idUsuario: currentUser.idUsuario,
            idPlano: selectedPlan.idPlano,
            dataInicio: today.toISOString().split('T')[0],
            dataFim: endDate.toISOString().split('T')[0],
          };
          await api.createAssinatura(newSubscription);

          // 2. Create Pagamento Record
          const payId = `pag-${Date.now()}`;
          const newPayment = {
            id: payId,
            idPagamento: payId,
            idAssinatura: subId,
            idUsuario: currentUser.idUsuario,
            valor: selectedPlan.preco,
            dataPagamento: today.toISOString(),
            metodoPagamento: paymentMethod,
            transacaoId: generatedTxId,
          };
          await api.createPagamento(newPayment);

          await refreshData();
          clearInterval(interval);
          setCheckoutStep(4);
        } catch (err) {
          console.error(err);
          showAlert('Erro ao processar assinatura.', 'error');
          setCheckoutStep(2);
        }
      }, 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [checkoutStep]);

  const handleNextStep = () => {
    if (checkoutStep === 1) {
      if (selectedPlan.preco === 0) {
        // Free plans skip payment method and go straight to processing
        setCheckoutStep(3);
      } else {
        setCheckoutStep(2);
      }
    } else if (checkoutStep === 2) {
      setCheckoutStep(3);
    }
  };

  const copyPixCode = () => {
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="container-fluid py-2">
      {/* Title */}
      <div className="mb-5 text-center">
        <h1 className="fw-bold text-light mb-2">Planos de Assinatura</h1>
        <p className="text-muted text-center mx-auto" style={{ maxWidth: '600px' }}>
          Escolha o plano ideal para liberar acesso completo a cursos exclusivos, trilhas estruturadas e certificados digitais emitidos na hora.
        </p>

        {activePlan && (
          <div className="alert alert-success border-success bg-success bg-opacity-10 text-success d-inline-block mt-3 px-4 py-2">
            Plano Ativo Atualmente: <strong>{activePlan.nome}</strong> {activeSubscription ? `(Expira em: ${activeSubscription.dataFim})` : '(Acesso Vitalício)'}
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="row g-4 justify-content-center">
        {planos.map((p) => {
          const isCurrentPlan = activePlan?.idPlano === p.idPlano;
          return (
            <div className="col-md-6 col-lg-4" key={p.idPlano}>
              <div className={`card bg-black border ${isCurrentPlan ? 'border-primary' : 'border-secondary'} text-white h-100 shadow-sm p-4 d-flex flex-column justify-content-between`}>
                <div>
                  <h4 className="fw-bold text-light mb-2">{p.nome}</h4>
                  <p className="text-muted small mb-4">{p.descricao}</p>
                  
                  <div className="mb-4">
                    <span className="display-5 fw-bold text-light">R$ {p.preco.toFixed(2)}</span>
                    <span className="text-muted"> / {p.duracaoMeses === 12 ? 'ano' : 'mês'}</span>
                  </div>

                  <ul className="list-unstyled mb-5 d-flex flex-column gap-3" style={{ fontSize: '14px' }}>
                    {p.vantagens && p.vantagens.length > 0 ? (
                      p.vantagens.map((item: string, idx: number) => {
                        const isDisabled = item.startsWith('-');
                        const cleanText = item.replace(/^[+-]\s*/, '');
                        return (
                          <li
                            key={idx}
                            className="d-flex align-items-center gap-2"
                            style={isDisabled ? { opacity: 0.6 } : undefined}
                          >
                            {isDisabled ? (
                              <X size={16} className="text-danger" />
                            ) : (
                              <Check size={16} className="text-success" />
                            )}
                            <span>{cleanText}</span>
                          </li>
                        );
                      })
                    ) : (
                      <>
                        <li className="d-flex align-items-center gap-2">
                          <Check size={16} className="text-success" />
                          <span>Acesso a todos os cursos catalogados</span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                          <Check size={16} className="text-success" />
                          <span>Emissão ilimitada de certificados</span>
                        </li>
                        <li className="d-flex align-items-center gap-2" style={p.preco === 0 ? { opacity: 0.6 } : undefined}>
                          {p.preco > 0 ? (
                            <Check size={16} className="text-success" />
                          ) : (
                            <X size={16} className="text-danger" />
                          )}
                          <span>Acesso completo às Trilhas de Estudos</span>
                        </li>
                        <li className="d-flex align-items-center gap-2" style={p.preco === 0 ? { opacity: 0.6 } : undefined}>
                          {p.preco > 0 ? (
                            <Check size={16} className="text-success" />
                          ) : (
                            <X size={16} className="text-danger" />
                          )}
                          <span>Suporte técnico prioritário de instrutores</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <div>
                  {isCurrentPlan ? (
                    <button className="btn btn-success w-100 fw-bold py-2.5" disabled>
                      Plano Ativo
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenCheckout(p)}
                      className="btn btn-primary w-100 fw-bold py-2.5"
                    >
                      {p.preco === 0 ? 'Aderir Grátis' : 'Assinar Plano'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Simulado Wizard Modal */}
      {selectedPlan && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary text-white shadow-lg" style={{ borderRadius: '14px' }}>
              
              {/* Modal Header */}
              {checkoutStep !== 3 && checkoutStep !== 4 && (
                <div className="modal-header border-secondary">
                  <h5 className="modal-title fw-bold">Checkout Simulado</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={handleCloseCheckout}></button>
                </div>
              )}

              <div className="modal-body">
                
                {/* STEP 1: ORDER SUMMARY */}
                {checkoutStep === 1 && (
                  <div>
                    <h6 className="text-primary fw-semibold mb-3">Passo 1: Resumo do Pedido</h6>
                    <div className="bg-black p-3 rounded border border-secondary border-opacity-50 mb-4">
                      <span className="text-muted small d-block">Item Selecionado:</span>
                      <strong className="fs-5 text-light">{selectedPlan.nome}</strong>
                      <hr className="border-secondary border-opacity-25 my-2" />
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Duração:</span>
                        <span className="small">{selectedPlan.duracaoMeses} {selectedPlan.duracaoMeses === 1 ? 'mês' : 'meses'}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <span className="text-muted small">Total:</span>
                        <strong className="text-warning fs-5">R$ {selectedPlan.preco.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-secondary btn-sm" onClick={handleCloseCheckout}>Cancelar</button>
                      <button className="btn btn-primary btn-sm px-4 fw-semibold" onClick={handleNextStep}>
                        {selectedPlan.preco === 0 ? 'Ativar Grátis' : 'Prosseguir para Pagamento'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: PAYMENT METHOD & DETAILS */}
                {checkoutStep === 2 && (
                  <div>
                    <h6 className="text-primary fw-semibold mb-3">Passo 2: Forma de Pagamento</h6>
                    
                    <div className="d-flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`btn btn-sm flex-grow-1 ${paymentMethod === 'pix' ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
                      >
                        Pix (Rápido)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cartao')}
                        className={`btn btn-sm flex-grow-1 ${paymentMethod === 'cartao' ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
                      >
                        Cartão de Crédito
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('boleto')}
                        className={`btn btn-sm flex-grow-1 ${paymentMethod === 'boleto' ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
                      >
                        Boleto
                      </button>
                    </div>

                    {/* PIX SCREEN */}
                    {paymentMethod === 'pix' && (
                      <div className="text-center py-2 mb-3">
                        <div className="d-inline-block p-2 bg-white rounded mb-3">
                          {/* Simulated QR Code styling */}
                          <div style={{ width: '120px', height: '120px', background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 10px 10px' }}></div>
                        </div>
                        <p className="text-muted small px-3">Escaneie o QR Code acima ou utilize a chave copia e cola abaixo.</p>
                        <div className="input-group input-group-sm mb-3">
                          <input type="text" readOnly className="form-control bg-black text-light border-secondary text-truncate" value="00020126580014br.gov.bcb.pix0136learngpt-pix-key-99923" />
                          <button className="btn btn-primary" type="button" onClick={copyPixCode}>
                            {copiedPix ? 'Copiado!' : 'Copiar'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CARD FORM */}
                    {paymentMethod === 'cartao' && (
                      <div className="row g-2 mb-4">
                        <div className="col-12">
                          <label className="form-label small text-muted mb-0">Nome Completo do Titular</label>
                          <input
                            type="text"
                            required
                            className="form-control form-control-sm bg-black border-secondary text-white"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="JONAS SILVA"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label small text-muted mb-0">Número do Cartão</label>
                          <input
                            type="text"
                            required
                            className="form-control form-control-sm bg-black border-secondary text-white"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4532 9823 8812 3901"
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small text-muted mb-0">Validade</label>
                          <input
                            type="text"
                            required
                            className="form-control form-control-sm bg-black border-secondary text-white"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/AA"
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small text-muted mb-0">CVV</label>
                          <input
                            type="text"
                            required
                            className="form-control form-control-sm bg-black border-secondary text-white"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="***"
                          />
                        </div>
                      </div>
                    )}

                    {/* BOLETO SCREEN */}
                    {paymentMethod === 'boleto' && (
                      <div className="alert alert-info border-info bg-info bg-opacity-10 text-info text-center py-3 mb-4">
                        O boleto bancário será gerado e compensado em até 2 dias úteis após o pagamento.
                      </div>
                    )}

                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-secondary btn-sm" onClick={() => setCheckoutStep(1)}>Voltar</button>
                      <button className="btn btn-primary btn-sm px-4 fw-semibold" onClick={handleNextStep}>
                        Finalizar e Pagar
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: LOADER SIMULATION */}
                {checkoutStep === 3 && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-4" style={{ width: '3rem', height: '3rem' }} role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                    <h5 className="fw-bold text-light mb-2">Processando Assinatura</h5>
                    <p className="text-muted small mb-0">{processingText}</p>
                  </div>
                )}

                {/* STEP 4: SUCCESS CONGRATULATIONS */}
                {checkoutStep === 4 && (
                  <div className="text-center py-4 px-2">
                    <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 border border-success rounded-circle mb-4" style={{ width: '80px', height: '80px', boxShadow: '0 0 24px rgba(25, 135, 84, 0.2)' }}>
                      <Check size={36} className="text-success" />
                    </div>
                    <h3 className="fw-bold text-light mb-3">Parabéns! Assinatura Ativa!</h3>
                    <p className="text-muted mb-4 px-3" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      O plano <strong>{selectedPlan.nome}</strong> foi assinado com sucesso. Seu acesso PRO está liberado!
                    </p>
                    
                    <div className="bg-black p-3 rounded border border-secondary border-opacity-50 text-start mb-4 small" style={{ fontSize: '12px' }}>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">ID da Transação:</span>
                        <span className="text-light font-monospace">{transacaoId}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Início do Acesso:</span>
                        <span className="text-light">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Valor Cobrado:</span>
                        <span className="text-success fw-bold">R$ {selectedPlan.preco.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary px-5 fw-bold py-2 rounded-pill shadow-sm"
                      onClick={handleCloseCheckout}
                    >
                      Ir para o Início
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
