import type { CursoModel } from './curso.model.tsx';
import type { TrilhaModel } from './trilha.model.tsx';

export interface TrilhaCursoModel {
  idTrilha: string;
  idCurso: string;
  trilha?: TrilhaModel;
  curso?: CursoModel;
  ordem: number;
}