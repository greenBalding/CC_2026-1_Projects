import type { CategoriaModel } from './categoria.model.tsx';
import type { UsuarioModel } from './usuario.model.tsx';

export interface CursoModel {
  idCurso: string;
  titulo: string;
  descricao: string;
  idCategoria: string;
  idInstrutor: string;
  categoria?: CategoriaModel;
  instrutor?: UsuarioModel;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  dataPublicacao: string;
  totalAulas: number;
  totalHoras: number;
}
