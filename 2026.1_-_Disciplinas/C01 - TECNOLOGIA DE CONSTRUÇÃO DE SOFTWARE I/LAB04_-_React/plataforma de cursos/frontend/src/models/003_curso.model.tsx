import type { CategoriaModel } from './002_categoria.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

export interface CursoModel {

  // [Preenchimento Automático] Identificador único
  idCurso: string;

  // [Preenchimento Manual] Informações gerais do curso
  titulo: string;
  descricao: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  bannerUrl?: string;

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras
  idCategoria: string;
  idInstrutor: string;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  categoria?: CategoriaModel;
  instrutor?: UsuarioModel;

  // [Preenchimento Automático] Estatísticas, datas e metadados
  dataPublicacao: string;
  totalAulas: number;
  totalHoras: number;
  
}
