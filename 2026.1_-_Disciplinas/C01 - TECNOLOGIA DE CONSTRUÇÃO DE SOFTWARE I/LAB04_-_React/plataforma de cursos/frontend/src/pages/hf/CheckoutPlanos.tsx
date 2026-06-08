import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { CheckIcon } from '../../components/Icons';

export default function CheckoutPlanos() {
  const { currentUser, planos, assinaturas, refreshData } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'boleto'>('pix');
  const [processing, setProcessing] = useState(false);

  // Card details form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  if (!currentUser) {
    return (
      <div className="alert alert-warning text-center mt-4" role="alert">
        Nenhum usuário logado. Por favor, selecione um usuário na barra superior.
      </div>
    );
  }

  const activeSubscription = assinaturas.find(
    (s) => s.idUsuario === currentUser.idUsuario
  );

  const activePlan = activeSubscription
    ? planos.find((p) => p.idPlano === activeSubscription.idPlano)
    : null;

  const handleOpenCheckout = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleCloseCheckout = () => {
    setSelectedPlan(null);
    setProcessing(false);
    // Reset inputs
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvv('');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setProcessing(true);

    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setMonth(today.getMonth() + selectedPlan.duracaoMeses);

      const subId = `sub-${Date.now()}`;
      
      // 1. Create Assinatura Record
      const newSubscription = {
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
        idPagamento: payId,
        idAssinatura: subId,
        idUsuario: currentUser.idUsuario,
        valor: selectedPlan.preco,
        dataPagamento: today.toISOString(),
        metodoPagamento: paymentMethod,
        transacaoId: `tx-${Math.floor(Math.random() * 900000000) + 100000000}`,
      };
      await api.createPagamento(newPayment);

      await refreshData();
      alert(`🎉 Parabéns! Plano "${selectedPlan.nome}" assinado com sucesso.`);
      handleCloseCheckout();
    } catch (err) {
      console.error(err);
      alert('Erro ao processar checkout do plano.');
      setProcessing(false);
    }
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
            🚀 Plano Ativo Atualmente: <strong>{activePlan.nome}</strong> (Expira em: {activeSubscription?.dataFim})
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
                    <li className="d-flex align-items-center gap-2">
                      <CheckIcon size={16} className="text-success" />
                      <span>Acesso a todos os cursos catalogados</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <CheckIcon size={16} className="text-success" />
                      <span>Emissão ilimitada de certificados</span>
                    </li>
                    {p.idPlano !== 'plan1' ? (
                      <>
                        <li className="d-flex align-items-center gap-2">
                          <CheckIcon size={16} className="text-success" />
                          <span>Acesso completo às Trilhas de Estudos</span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                          <CheckIcon size={16} className="text-success" />
                          <span>Suporte técnico prioritário de instrutores</span>
                        </li>
                      </>
                    ) : (
                      <li className="d-flex align-items-center gap-2 text-muted">
                        <span>✖ Sem acesso a Trilhas e suporte</span>
                      </li>
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
                      disabled={p.preco === 0 && activePlan !== null}
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

      {/* Checkout Simulado Modal */}
      {selectedPlan && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">Checkout: {selectedPlan.nome}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseCheckout}></button>
              </div>
              <form onSubmit={handleCheckoutSubmit}>
                <div className="modal-body">
                  <div className="mb-4">
                    <span className="text-muted small d-block">Resumo do Pedido:</span>
                    <div className="d-flex justify-content-between mt-1">
                      <strong>Plano {selectedPlan.nome} ({selectedPlan.duracaoMeses} {selectedPlan.duracaoMeses === 1 ? 'mês' : 'meses'})</strong>
                      <span className="text-primary fw-bold">R$ {selectedPlan.preco.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment selection */}
                  {selectedPlan.preco > 0 && (
                    <div className="mb-4">
                      <label className="form-label text-muted small">Escolha o Método de Pagamento:</label>
                      <div className="d-flex gap-2">
                        <input
                          type="radio"
                          className="btn-check"
                          name="payment"
                          id="btn-pix"
                          checked={paymentMethod === 'pix'}
                          onChange={() => setPaymentMethod('pix')}
                        />
                        <label className="btn btn-outline-secondary flex-grow-1" htmlFor="btn-pix">
                          ⚡ Pix
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="payment"
                          id="btn-cartao"
                          checked={paymentMethod === 'cartao'}
                          onChange={() => setPaymentMethod('cartao')}
                        />
                        <label className="btn btn-outline-secondary flex-grow-1" htmlFor="btn-cartao">
                          💳 Cartão
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="payment"
                          id="btn-boleto"
                          checked={paymentMethod === 'boleto'}
                          onChange={() => setPaymentMethod('boleto')}
                        />
                        <label className="btn btn-outline-secondary flex-grow-1" htmlFor="btn-boleto">
                          📄 Boleto
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Form fields based on selection */}
                  {selectedPlan.preco > 0 && paymentMethod === 'cartao' && (
                    <div className="row g-2 mb-3">
                      <div className="col-12">
                        <label className="form-label small text-muted mb-1">Nome no Cartão</label>
                        <input
                          type="text"
                          className="form-control bg-black text-white border-secondary form-control-sm"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small text-muted mb-1">Número do Cartão</label>
                        <input
                          type="text"
                          className="form-control bg-black text-white border-secondary form-control-sm"
                          placeholder="xxxx xxxx xxxx xxxx"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div className="col-8">
                        <label className="form-label small text-muted mb-1">Validade</label>
                        <input
                          type="text"
                          className="form-control bg-black text-white border-secondary form-control-sm"
                          placeholder="MM/AA"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label small text-muted mb-1">CVV</label>
                        <input
                          type="text"
                          className="form-control bg-black text-white border-secondary form-control-sm"
                          placeholder="***"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {selectedPlan.preco > 0 && paymentMethod === 'pix' && (
                    <div className="alert alert-info border-info bg-info bg-opacity-10 text-info text-center py-3">
                      Pix selecionado. Um QR Code de pagamento será gerado na confirmação.
                    </div>
                  )}

                  {selectedPlan.preco > 0 && paymentMethod === 'boleto' && (
                    <div className="alert alert-info border-info bg-info bg-opacity-10 text-info text-center py-3">
                      Boleto selecionado. A compensação pode levar até 2 dias úteis.
                    </div>
                  )}

                  {selectedPlan.preco === 0 && (
                    <div className="alert alert-success border-success bg-success bg-opacity-10 text-success text-center py-3">
                      Este plano é gratuito. Nenhum pagamento é necessário.
                    </div>
                  )}
                </div>

                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseCheckout}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={processing} className="btn btn-primary px-4">
                    {processing ? 'Confirmando...' : 'Confirmar & Finalizar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
