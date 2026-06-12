import type { CursoModel } from './003_curso.model.tsx';
import type { TrilhaModel } from './009_trilha.model.tsx';

export interface TrilhaCursoModel {

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras (Associação entre Trilha e Curso)
  idTrilha: string;
  idCurso: string;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  trilha?: TrilhaModel;
  curso?: CursoModel;

  // [Preenchimento Manual] Controle de ordenação do curso dentro da trilha
  ordem: number;

}