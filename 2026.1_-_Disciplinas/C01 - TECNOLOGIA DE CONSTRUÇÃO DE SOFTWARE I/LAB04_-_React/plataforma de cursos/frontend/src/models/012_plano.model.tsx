export interface PlanoModel {

  // [Preenchimento Automático] Identificador único
  idPlano: string;

  // [Preenchimento Manual] Informações de marketing/apresentação do plano
  nome: string;
  descricao: string;

  // [Preenchimento Manual] Valores financeiros e regras de negócio de tempo
  preco: number;
  duracaoMeses: number;
  vantagens?: string[];
}