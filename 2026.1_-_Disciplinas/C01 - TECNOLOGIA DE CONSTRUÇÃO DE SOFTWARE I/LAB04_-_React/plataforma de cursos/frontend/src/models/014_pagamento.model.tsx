import type { AssinaturaModel } from './013_assinatura.model.tsx';

export interface PagamentoModel {

  // [Preenchimento Automático] Identificador único
  idPagamento: string;

  // [Preenchimento Manual] Informações financeiras do pagamento
  valor: number;
  metodoPagamento: string;

  // [Preenchimento Automático] Transações financeiras do gateway
  transacaoId: string;

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras (Vinculado a uma assinatura contratada e a um usuário pagador)
  idAssinatura: string;
  idUsuario: string;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  assinatura?: AssinaturaModel;

  // [Preenchimento Automático] Histórico e registro
  dataPagamento: string;
  
}