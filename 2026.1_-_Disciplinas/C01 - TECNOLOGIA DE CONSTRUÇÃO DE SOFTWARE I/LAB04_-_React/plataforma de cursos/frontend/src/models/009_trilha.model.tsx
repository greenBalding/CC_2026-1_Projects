import type { CategoriaModel } from './002_categoria.model.tsx';

export interface TrilhaModel {

  idTrilha: string;
  titulo: string;
  descricao: string;
  idCategoria: string;
  categoria?: CategoriaModel;
  
}