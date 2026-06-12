import type { CategoriaModel } from './002_categoria.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

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
  bannerUrl?: string;
  
}
