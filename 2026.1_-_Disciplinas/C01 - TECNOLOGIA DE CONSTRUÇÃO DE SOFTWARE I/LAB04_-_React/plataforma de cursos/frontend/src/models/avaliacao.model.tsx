import type { CursoModel } from './curso.model.tsx';
import type { UsuarioModel } from './usuario.model.tsx';

export interface AvaliacaoModel {
  idAvaliacao: string;
  idUsuario: string;
  idCurso: string;
  usuario?: UsuarioModel;
  curso?: CursoModel;
  nota: "1" | "2" | "3" | "4" | "5";
  comentario: string | null;
  dataAvaliacao: string;
}