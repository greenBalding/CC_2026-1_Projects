import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import type { UsuarioModel } from '../models/usuario.model';
import type { CategoriaModel } from '../models/categoria.model';
import type { CursoModel } from '../models/curso.model';
import type { ModuloModel } from '../models/modulo.model';
import type { AulaModel } from '../models/aula.model';
import type { MatriculaModel } from '../models/matricula.model';
import type { ProgressoAulaModel } from '../models/progresso-aula.model';
import type { CertificadoModel } from '../models/certificado.model';
import type { PlanoModel } from '../models/plano.model';
import type { AssinaturaModel } from '../models/assinatura.model';
import type { PagamentoModel } from '../models/pagamento.model';
import type { TrilhaModel } from '../models/trilha.model';
import type { TrilhaCursoModel } from '../models/trilha-curso.model';
import type { AvaliacaoModel } from '../models/avaliacao.model';

interface AppContextType {
  currentUser: UsuarioModel | null;
  setCurrentUser: (user: UsuarioModel | null) => void;
  usuarios: UsuarioModel[];
  categorias: CategoriaModel[];
  cursos: CursoModel[];
  modulos: ModuloModel[];
  aulas: AulaModel[];
  matriculas: MatriculaModel[];
  progressoAulas: ProgressoAulaModel[];
  certificados: CertificadoModel[];
  planos: PlanoModel[];
  assinaturas: AssinaturaModel[];
  pagamentos: PagamentoModel[];
  trilhas: TrilhaModel[];
  trilhasCursos: TrilhaCursoModel[];
  avaliacoes: AvaliacaoModel[];
  loading: boolean;
  refreshData: () => Promise<void>;
  showAlert: (message: string, type?: 'success' | 'error' | 'alert', title?: string) => void;
  showConfirm: (message: string, onConfirm: () => void, title?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UsuarioModel | null>(() => {
    const stored = localStorage.getItem('learngpt_user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [usuarios, setUsuarios] = useState<UsuarioModel[]>([]);
  const [categorias, setCategorias] = useState<CategoriaModel[]>([]);
  const [cursos, setCursos] = useState<CursoModel[]>([]);
  const [modulos, setModulos] = useState<ModuloModel[]>([]);
  const [aulas, setAulas] = useState<AulaModel[]>([]);
  const [matriculas, setMatriculas] = useState<MatriculaModel[]>([]);
  const [progressoAulas, setProgressoAulas] = useState<ProgressoAulaModel[]>([]);
  const [certificados, setCertificados] = useState<CertificadoModel[]>([]);
  const [planos, setPlanos] = useState<PlanoModel[]>([]);
  const [assinaturas, setAssinaturas] = useState<AssinaturaModel[]>([]);
  const [pagamentos, setPagamentos] = useState<PagamentoModel[]>([]);
  const [trilhas, setTrilhas] = useState<TrilhaModel[]>([]);
  const [trilhasCursos, setTrilhasCursos] = useState<TrilhaCursoModel[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoModel[]>([]);
  const [loading, setLoading] = useState(true);

  interface ModalState {
    isOpen: boolean;
    type: 'success' | 'error' | 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
  });

  const showAlert = (message: string, type: 'success' | 'error' | 'alert' = 'alert', title?: string) => {
    const defaultTitle = type === 'success' ? 'Sucesso!' : type === 'error' ? 'Erro' : 'Aviso';
    setModal({
      isOpen: true,
      type,
      title: title || defaultTitle,
      message,
      onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const showConfirm = (message: string, onConfirm: () => void, title = 'Confirmação') => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm: () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
        onConfirm();
      },
      onCancel: () => setModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const refreshData = async () => {
    try {
      const [
        usersList,
        catsList,
        coursesList,
        modsList,
        lessonsList,
        enrollsList,
        progList,
        certsList,
        plansList,
        subsList,
        paysList,
        trilhasList,
        trilhasCursosList,
        evalsList,
      ] = await Promise.all([
        api.getUsuarios(),
        api.getCategorias(),
        api.getCursos(),
        api.getModulos(),
        api.getAulas(),
        api.getMatriculas(),
        api.getProgressoAulas(),
        api.getCertificados(),
        api.getPlanos(),
        api.getAssinaturas(),
        api.getPagamentos(),
        api.getTrilhas(),
        api.getTrilhasCursos(),
        api.getAvaliacoes(),
      ]);

      setUsuarios(usersList);
      setCategorias(catsList);
      setCursos(coursesList);
      setModulos(modsList);
      setAulas(lessonsList);
      setMatriculas(enrollsList);
      setProgressoAulas(progList);
      setCertificados(certsList);
      setPlanos(plansList);
      setAssinaturas(subsList);
      setPagamentos(paysList);
      setTrilhas(trilhasList);
      setTrilhasCursos(trilhasCursosList);
      setAvaliacoes(evalsList);

      // Restore active user if still in the list, otherwise clear session
      if (currentUser) {
        const found = usersList.find((u) => u.idUsuario === currentUser.idUsuario);
        if (found) {
          setCurrentUserState(found);
          localStorage.setItem('learngpt_user', JSON.stringify(found));
        } else {
          setCurrentUserState(null);
          localStorage.removeItem('learngpt_user');
        }
      }
    } catch (error) {
      console.error('Failed to load application data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const setCurrentUser = (user: UsuarioModel | null) => {
    if (user) {
      localStorage.setItem('learngpt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('learngpt_user');
    }
    setCurrentUserState(user);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        usuarios,
        categorias,
        cursos,
        modulos,
        aulas,
        matriculas,
        progressoAulas,
        certificados,
        planos,
        assinaturas,
        pagamentos,
        trilhas,
        trilhasCursos,
        avaliacoes,
        loading,
        refreshData,
        showAlert,
        showConfirm,
      }}
    >
      {children}

      {/* Global Custom Alert/Confirm Modal */}
      {modal.isOpen && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
            <div className="modal-content bg-dark border border-secondary text-white shadow-lg animate-scale" style={{ borderRadius: '16px' }}>
              <div className="modal-body text-center p-4">
                {/* Dynamic Icon */}
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
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
