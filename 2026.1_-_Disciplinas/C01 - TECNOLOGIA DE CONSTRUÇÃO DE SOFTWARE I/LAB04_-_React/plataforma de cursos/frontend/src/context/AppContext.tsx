import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';
import GlobalModal from '../components/ui/Modal';
import type {
  UsuarioModel,
  CategoriaModel,
  CursoModel,
  ModuloModel,
  AulaModel,
  MatriculaModel,
  ProgressoAulaModel,
  AvaliacaoModel,
  CertificadoModel,
  PlanoModel,
  AssinaturaModel,
  PagamentoModel,
  TrilhaModel,
  TrilhaCursoModel
} from '../models/000_index';

export interface AppContextType {
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
  avaliacoes: AvaliacaoModel[];
  trilhas: TrilhaModel[];
  trilhasCursos: TrilhaCursoModel[];
  loading: boolean;
  refreshData: () => Promise<void>;
  showAlert: (message: string, type?: 'success' | 'error' | 'alert', title?: string) => void;
  showConfirm: (message: string, onConfirm: () => void, title?: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface ModalState {
  isOpen: boolean;
  type: 'success' | 'error' | 'alert' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UsuarioModel | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
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
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoModel[]>([]);
  const [trilhas, setTrilhas] = useState<TrilhaModel[]>([]);
  const [trilhasCursos, setTrilhasCursos] = useState<TrilhaCursoModel[]>([]);
  const [loading, setLoading] = useState(true);

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
      setAvaliacoes(evalsList);
      setTrilhas(trilhasList);
      setTrilhasCursos(trilhasCursosList);

      // Restore active user if still in the list, otherwise clear session
      if (currentUser) {
        const found = usersList.find((u) => u.idUsuario === currentUser.idUsuario);
        if (found) {
          setCurrentUserState(found);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(found));
        } else {
          setCurrentUserState(null);
          localStorage.removeItem(STORAGE_KEYS.USER);
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
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
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
        avaliacoes,
        trilhas,
        trilhasCursos,
        loading,
        refreshData,
        showAlert,
        showConfirm,
      }}
    >
      {children}

      {/* Global Custom Alert/Confirm Modal */}
      <GlobalModal modal={modal} />
    </AppContext.Provider>
  );
}
