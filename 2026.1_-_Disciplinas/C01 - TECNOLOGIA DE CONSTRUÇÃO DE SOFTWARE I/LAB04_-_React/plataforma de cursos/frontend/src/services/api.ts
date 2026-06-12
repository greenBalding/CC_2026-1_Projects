import type {
  UsuarioModel,
  CategoriaModel,
  CursoModel,
  ModuloModel,
  AulaModel,
  MatriculaModel,
  ProgressoAulaModel,
  AvaliacaoModel,
  TrilhaModel,
  TrilhaCursoModel,
  CertificadoModel,
  PlanoModel,
  AssinaturaModel,
  PagamentoModel
} from '../models/000_index';

import { API_URL } from '../utils/constants';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!res.ok) {
    if (res.status === 404 && (!options || !options.method || options.method.toUpperCase() === 'GET')) {
      return [] as unknown as T;
    }
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
  updateUsuario: async (idUsuario: string, data: Partial<UsuarioModel>) => {
    const list = await api.getUsuarios();
    const found = list.find((u) => u.idUsuario === idUsuario);
    const dbId = found ? ((found as any).id || found.idUsuario) : idUsuario;
    return request<UsuarioModel>(`/usuarios/${dbId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteUsuario: async (idUsuario: string) => {
    const list = await api.getUsuarios();
    const found = list.find((u) => u.idUsuario === idUsuario);
    const dbId = found ? ((found as any).id || found.idUsuario) : idUsuario;
    return request<void>(`/usuarios/${dbId}`, {
      method: 'DELETE',
    });
  },

  // ─── CATEGORIAS ────────────────────────────────────────────────
  getCategorias: () => request<CategoriaModel[]>('/categorias'),
  createCategoria: (data: CategoriaModel) =>
    request<CategoriaModel>('/categorias', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategoria: async (idCategoria: string, data: Partial<CategoriaModel>) => {
    const list = await api.getCategorias();
    const found = list.find((c) => c.idCategoria === idCategoria);
    const dbId = found ? ((found as any).id || found.idCategoria) : idCategoria;
    return request<CategoriaModel>(`/categorias/${dbId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteCategoria: async (idCategoria: string) => {
    const list = await api.getCategorias();
    const found = list.find((c) => c.idCategoria === idCategoria);
    const dbId = found ? ((found as any).id || found.idCategoria) : idCategoria;
    return request<void>(`/categorias/${dbId}`, {
      method: 'DELETE',
    });
  },

  // ─── CURSOS ────────────────────────────────────────────────────
  getCursos: () => request<CursoModel[]>('/cursos'),
  createCurso: (data: CursoModel) =>
    request<CursoModel>('/cursos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCurso: async (idCurso: string, data: Partial<CursoModel>) => {
    const list = await api.getCursos();
    const found = list.find((c) => c.idCurso === idCurso);
    const dbId = found ? ((found as any).id || found.idCurso) : idCurso;
    return request<CursoModel>(`/cursos/${dbId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteCurso: async (idCurso: string) => {
    const list = await api.getCursos();
    const found = list.find((c) => c.idCurso === idCurso);
    const dbId = found ? ((found as any).id || found.idCurso) : idCurso;
    return request<void>(`/cursos/${dbId}`, {
      method: 'DELETE',
    });
  },

  // ─── MODULOS ───────────────────────────────────────────────────
  getModulos: () => request<ModuloModel[]>('/modulos'),
  createModulo: (data: ModuloModel) =>
    request<ModuloModel>('/modulos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateModulo: async (idModulo: string, data: Partial<ModuloModel>) => {
    const list = await api.getModulos();
    const found = list.find((m) => m.idModulo === idModulo);
    const dbId = found ? ((found as any).id || found.idModulo) : idModulo;
    return request<ModuloModel>(`/modulos/${dbId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteModulo: async (idModulo: string) => {
    const list = await api.getModulos();
    const found = list.find((m) => m.idModulo === idModulo);
    const dbId = found ? ((found as any).id || found.idModulo) : idModulo;
    return request<void>(`/modulos/${dbId}`, {
      method: 'DELETE',
    });
  },

  // ─── AULAS ─────────────────────────────────────────────────────
  getAulas: () => request<AulaModel[]>('/aulas'),
  createAula: (data: AulaModel) =>
    request<AulaModel>('/aulas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAula: async (idAula: string, data: Partial<AulaModel>) => {
    const list = await api.getAulas();
    const found = list.find((a) => a.idAula === idAula);
    const dbId = found ? ((found as any).id || found.idAula) : idAula;
    return request<AulaModel>(`/aulas/${dbId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteAula: async (idAula: string) => {
    const list = await api.getAulas();
    const found = list.find((a) => a.idAula === idAula);
    const dbId = found ? ((found as any).id || found.idAula) : idAula;
    return request<void>(`/aulas/${dbId}`, {
      method: 'DELETE',
    });
  },

  // ─── MATRICULAS ────────────────────────────────────────────────
  getMatriculas: () => request<MatriculaModel[]>('/matriculas'),
  createMatricula: (data: MatriculaModel) =>
    request<MatriculaModel>('/matriculas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteMatricula: (id: string) =>
    request<void>(`/matriculas/${id}`, {
      method: 'DELETE',
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
  updateAvaliacao: async (idAvaliacao: string, data: Partial<AvaliacaoModel>) => {
    const list = await api.getAvaliacoes();
    const found = list.find((a) => a.idAvaliacao === idAvaliacao);
    const dbId = found ? ((found as any).id || found.idAvaliacao) : idAvaliacao;
    return request<AvaliacaoModel>(`/avaliacoes/${dbId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteAvaliacao: async (idAvaliacao: string) => {
    const list = await api.getAvaliacoes();
    const found = list.find((a) => a.idAvaliacao === idAvaliacao);
    const dbId = found ? ((found as any).id || found.idAvaliacao) : idAvaliacao;
    return request<void>(`/avaliacoes/${dbId}`, {
      method: 'DELETE',
    });
  },

  // ─── TRILHAS ───────────────────────────────────────────────────
  getTrilhas: () => request<TrilhaModel[]>('/trilhas'),
  createTrilha: (data: TrilhaModel) =>
    request<TrilhaModel>('/trilhas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTrilha: async (idTrilha: string, data: Partial<TrilhaModel>) => {
    const list = await api.getTrilhas();
    const found = list.find((t) => t.idTrilha === idTrilha);
    const dbId = found ? ((found as any).id || found.idTrilha) : idTrilha;
    return request<TrilhaModel>(`/trilhas/${dbId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteTrilha: async (idTrilha: string) => {
    const list = await api.getTrilhas();
    const found = list.find((t) => t.idTrilha === idTrilha);
    const dbId = found ? ((found as any).id || found.idTrilha) : idTrilha;
    return request<void>(`/trilhas/${dbId}`, {
      method: 'DELETE',
    });
  },

  // ─── TRILHAS CURSOS ────────────────────────────────────────────
  getTrilhasCursos: () => request<TrilhaCursoModel[]>('/trilhas_cursos'),
  createTrilhaCurso: (data: TrilhaCursoModel) =>
    request<TrilhaCursoModel>('/trilhas_cursos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTrilhaCurso: async (id: string, data: Partial<TrilhaCursoModel>) => {
    return request<TrilhaCursoModel>(`/trilhas_cursos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteTrilhaCurso: async (id: string) => {
    return request<void>(`/trilhas_cursos/${id}`, {
      method: 'DELETE',
    });
  },

  // ─── CERTIFICADOS ──────────────────────────────────────────────
  getCertificados: () => request<CertificadoModel[]>('/certificados'),
  createCertificado: (data: CertificadoModel) =>
    request<CertificadoModel>('/certificados', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── PLANOS ────────────────────────────────────────────────────
  getPlanos: () => request<PlanoModel[]>('/planos'),
  createPlano: (data: PlanoModel) =>
    request<PlanoModel>('/planos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePlano: async (idPlano: string, data: Partial<PlanoModel>) => {
    const list = await api.getPlanos();
    const found = list.find((p) => p.idPlano === idPlano);
    const dbId = found ? ((found as any).id || found.idPlano) : idPlano;
    return request<PlanoModel>(`/planos/${dbId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deletePlano: async (idPlano: string) => {
    const list = await api.getPlanos();
    const found = list.find((p) => p.idPlano === idPlano);
    const dbId = found ? ((found as any).id || found.idPlano) : idPlano;
    return request<void>(`/planos/${dbId}`, {
      method: 'DELETE',
    });
  },

  // ─── ASSINATURAS ───────────────────────────────────────────────
  getAssinaturas: () => request<AssinaturaModel[]>('/assinaturas'),
  createAssinatura: (data: AssinaturaModel) =>
    request<AssinaturaModel>('/assinaturas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAssinatura: async (idAssinatura: string, data: Partial<AssinaturaModel>) => {
    const list = await api.getAssinaturas();
    const found = list.find((a) => a.idAssinatura === idAssinatura);
    const dbId = found ? ((found as any).id || found.idAssinatura) : idAssinatura;
    return request<AssinaturaModel>(`/assinaturas/${dbId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteAssinatura: async (idAssinatura: string) => {
    const list = await api.getAssinaturas();
    const found = list.find((a) => a.idAssinatura === idAssinatura);
    const dbId = found ? ((found as any).id || found.idAssinatura) : idAssinatura;
    return request<void>(`/assinaturas/${dbId}`, {
      method: 'DELETE',
    });
  },

  // ─── PAGAMENTOS ────────────────────────────────────────────────
  getPagamentos: () => request<PagamentoModel[]>('/pagamentos'),
  createPagamento: (data: PagamentoModel) =>
    request<PagamentoModel>('/pagamentos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deletePagamento: async (idPagamento: string) => {
    const list = await api.getPagamentos();
    const found = list.find((p) => p.idPagamento === idPagamento);
    const dbId = found ? ((found as any).id || found.idPagamento) : idPagamento;
    return request<void>(`/pagamentos/${dbId}`, {
      method: 'DELETE',
    });
  },
};
