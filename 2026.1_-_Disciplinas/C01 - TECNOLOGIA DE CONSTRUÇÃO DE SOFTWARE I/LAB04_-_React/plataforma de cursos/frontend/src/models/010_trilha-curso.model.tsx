import type { CursoModel } from './003_curso.model.tsx';
import type { TrilhaModel } from './009_trilha.model.tsx';

export interface TrilhaCursoModel {

  idTrilha: string;
  idCurso: string;
  trilha?: TrilhaModel;
  curso?: CursoModel;
  ordem: number;

}