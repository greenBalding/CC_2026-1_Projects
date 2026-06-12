import type { CategoriaModel } from './002_categoria.model.tsx';

export interface TrilhaModel {

  // [Preenchimento Automático] Identificador único
  idTrilha: string;

  // [Preenchimento Manual] Informações gerais
  titulo: string;
  descricao: string;

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras
  idCategoria: string;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  categoria?: CategoriaModel;
  
}