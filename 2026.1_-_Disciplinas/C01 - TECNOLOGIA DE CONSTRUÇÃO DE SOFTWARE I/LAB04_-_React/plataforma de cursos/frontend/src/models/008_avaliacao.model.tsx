import type { CursoModel } from './003_curso.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

export interface AvaliacaoModel {

  // [Preenchimento Automático] Identificador único
  idAvaliacao: string;

  // [Preenchimento Manual] Dados da avaliação e feedback
  nota: "1" | "2" | "3" | "4" | "5";
  comentario: string | null;

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras
  idUsuario: string;
  idCurso: string;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  usuario?: UsuarioModel;
  curso?: CursoModel;

  // [Preenchimento Automático] Histórico e metadados
  dataAvaliacao: string;
  
}