import type { ModuloModel } from './modulo.model.tsx';

export interface AulaModel {
  idAula: string;
  idModulo: string;
  modulo?: ModuloModel;
  titulo: string;
  tipoConteudo: 'video' | 'texto' | 'quiz' | 'outro';
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
}