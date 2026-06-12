import type { CursoModel } from './003_curso.model.tsx';

export interface ModuloModel {

  // [Preenchimento Automático] Identificador único
  idModulo: string;

  // [Preenchimento Manual] Informações gerais
  titulo: string;

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras
  idCurso: string;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  curso?: CursoModel;

  // [Preenchimento Manual] Controle de ordenação
  ordem: number;
  
}