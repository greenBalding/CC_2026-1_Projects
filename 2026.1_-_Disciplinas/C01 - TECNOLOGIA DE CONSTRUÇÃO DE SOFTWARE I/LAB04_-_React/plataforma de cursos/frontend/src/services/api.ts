import type { UsuarioModel } from '../models/usuario.model';
import type { CategoriaModel } from '../models/categoria.model';
import type { CursoModel } from '../models/curso.model';
import type { ModuloModel } from '../models/modulo.model';
import type { AulaModel } from '../models/aula.model';
import type { MatriculaModel } from '../models/matricula.model';
import type { ProgressoAulaModel } from '../models/progresso-aula.model';
import type { AvaliacaoModel } from '../models/avaliacao.model';
import type { TrilhaModel } from '../models/trilha.model';
import type { TrilhaCursoModel } from '../models/trilha-curso.model';
import type { CertificadoModel } from '../models/certificado.model';
import type { PlanoModel } from '../models/plano.model';
import type { AssinaturaModel } from '../models/assinatura.model';
import type { PagamentoModel } from '../models/pagamento.model';

const API_URL = 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
}

// ─── USUARIOS ──────────────────────────────────────────────────
export const api = {
  getUsuarios: () => request<UsuarioModel[]>('/usuarios'),
  createUsuario: (data: UsuarioModel) =>
    request<UsuarioModel>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateUsuario: (id: string, data: Partial<UsuarioModel>) =>
    request<UsuarioModel>(`/usuarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // ─── CATEGORIAS ────────────────────────────────────────────────
  getCategorias: () => request<CategoriaModel[]>('/categorias'),
  createCategoria: (data: CategoriaModel) =>
    request<CategoriaModel>('/categorias', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── CURSOS ────────────────────────────────────────────────────
  getCursos: () => request<CursoModel[]>('/cursos'),
  createCurso: (data: CursoModel) =>
    request<CursoModel>('/cursos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── MODULOS ───────────────────────────────────────────────────
  getModulos: () => request<ModuloModel[]>('/modulos'),
  createModulo: (data: ModuloModel) =>
    request<ModuloModel>('/modulos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── AULAS ─────────────────────────────────────────────────────
  getAulas: () => request<AulaModel[]>('/aulas'),
  createAula: (data: AulaModel) =>
    request<AulaModel>('/aulas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── MATRICULAS ────────────────────────────────────────────────
  getMatriculas: () => request<MatriculaModel[]>('/matriculas'),
  createMatricula: (data: MatriculaModel) =>
    request<MatriculaModel>('/matriculas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── PROGRESSO AULAS ──────────────────────────────────────────
  getProgressoAulas: () => request<ProgressoAulaModel[]>('/progresso_aulas'),
  upsertProgressoAula: async (data: ProgressoAulaModel) => {
    // Check if progress already exists
    const progressList = await api.getProgressoAulas();
    const existing = progressList.find(
      (p) => p.idUsuario === data.idUsuario && p.idAula === data.idAula
    );
    if (existing) {
      return request<ProgressoAulaModel>(`/progresso_aulas/${existing.idUsuario}-${existing.idAula}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).catch(() => {
        // Fallback for json-server composite key if id is just standard string-based single ID
        const jsonServerId = (existing as any).id || `${existing.idUsuario}-${existing.idAula}`;
        return request<ProgressoAulaModel>(`/progresso_aulas/${jsonServerId}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      });
    } else {
      return request<ProgressoAulaModel>('/progresso_aulas', {
        method: 'POST',
        // Make sure it has a flat id for JSON Server compatibility if needed
        body: JSON.stringify({
          id: `${data.idUsuario}-${data.idAula}`,
          ...data,
        }),
      });
    }
  },

  // ─── AVALIACOES ───────────────────────────────────────────────
  getAvaliacoes: () => request<AvaliacaoModel[]>('/avaliacoes'),
  createAvaliacao: (data: AvaliacaoModel) =>
    request<AvaliacaoModel>('/avaliacoes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── TRILHAS ───────────────────────────────────────────────────
  getTrilhas: () => request<TrilhaModel[]>('/trilhas'),
  createTrilha: (data: TrilhaModel) =>
    request<TrilhaModel>('/trilhas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── TRILHAS CURSOS ────────────────────────────────────────────
  getTrilhasCursos: () => request<TrilhaCursoModel[]>('/trilhas_cursos'),
  createTrilhaCurso: (data: TrilhaCursoModel) =>
    request<TrilhaCursoModel>('/trilhas_cursos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── CERTIFICADOS ──────────────────────────────────────────────
  getCertificados: () => request<CertificadoModel[]>('/certificados'),
  createCertificado: (data: CertificadoModel) =>
    request<CertificadoModel>('/certificados', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── PLANOS ────────────────────────────────────────────────────
  getPlanos: () => request<PlanoModel[]>('/planos'),

  // ─── ASSINATURAS ───────────────────────────────────────────────
  getAssinaturas: () => request<AssinaturaModel[]>('/assinaturas'),
  createAssinatura: (data: AssinaturaModel) =>
    request<AssinaturaModel>('/assinaturas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── PAGAMENTOS ────────────────────────────────────────────────
  getPagamentos: () => request<PagamentoModel[]>('/pagamentos'),
  createPagamento: (data: PagamentoModel) =>
    request<PagamentoModel>('/pagamentos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
