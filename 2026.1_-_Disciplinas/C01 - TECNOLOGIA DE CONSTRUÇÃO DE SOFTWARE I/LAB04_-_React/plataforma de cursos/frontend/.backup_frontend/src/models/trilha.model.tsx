import type { CategoriaModel } from './categoria.model.tsx';

export interface TrilhaModel {
  idTrilha: string;
  titulo: string;
  descricao: string;
  idCategoria: string;
  categoria?: CategoriaModel;
}