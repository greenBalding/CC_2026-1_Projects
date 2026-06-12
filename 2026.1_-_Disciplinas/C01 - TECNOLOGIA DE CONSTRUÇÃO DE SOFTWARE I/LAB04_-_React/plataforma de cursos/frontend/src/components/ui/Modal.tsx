interface ModalState {
  isOpen: boolean;
  type: 'success' | 'error' | 'alert' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface GlobalModalProps {
  modal: ModalState;
}

export default function GlobalModal({ modal }: GlobalModalProps) {
  if (!modal.isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
        <div className="modal-content bg-dark border border-secondary text-white shadow-lg animate-scale" style={{ borderRadius: '16px' }}>
          <div className="modal-body text-center p-4">
            {/* Ícone Dinâmico */}
            <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle" style={{
              width: '70px',
              height: '70px',
              backgroundColor: modal.type === 'success' ? 'rgba(25, 135, 84, 0.1)' : modal.type === 'error' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
              border: `2px solid ${modal.type === 'success' ? '#198754' : modal.type === 'error' ? '#dc3545' : '#ffc107'}`,
            }}>
              {modal.type === 'success' && (
                <svg className="text-success" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              {modal.type === 'error' && (
                <svg className="text-danger" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              )}
              {(modal.type === 'alert' || modal.type === 'confirm') && (
                <svg className="text-warning" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
            </div>

            <h4 className="fw-bold mb-2 text-light">{modal.title}</h4>
            <p className="text-muted mb-4 px-2" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              {modal.message}
            </p>

            <div className="d-flex gap-2 justify-content-center">
              {modal.type === 'confirm' ? (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 fw-semibold rounded-pill"
                    onClick={modal.onCancel}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary px-4 fw-semibold rounded-pill"
                    onClick={modal.onConfirm}
                  >
                    Confirmar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary px-5 fw-semibold rounded-pill"
                  onClick={modal.onConfirm}
                >
                  Ok
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
