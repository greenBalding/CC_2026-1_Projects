import type { CursoModel } from './curso.model.tsx';

export interface ModuloModel {
  idModulo: string;
  idCurso: string;
  curso?: CursoModel;
  titulo: string;
  ordem: number;
}