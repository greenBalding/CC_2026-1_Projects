export interface CategoriaModel {

  // [Preenchimento Automático] Identificador único
  idCategoria: string;

  // [Preenchimento Manual] Informações gerais
  nome: string;
  descricao: string;

  // [Preenchimento Automático] Status e controle
  ativa: boolean;
  
}
