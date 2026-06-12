import type { ModuloModel } from './004_modulo.model.tsx';

export interface AulaModel {

  // [Preenchimento Automático] Identificador único
  idAula: string;

  // [Preenchimento Manual] Informações gerais e conteúdo da aula
  titulo: string;
  tipoConteudo: 'video' | 'texto' | 'quiz' | 'outro';
  urlConteudo: string;

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras
  idModulo: string;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  modulo?: ModuloModel;

  // [Preenchimento Manual] Duração e controle de ordenação
  duracaoMinutos: number;
  ordem: number;
  
}