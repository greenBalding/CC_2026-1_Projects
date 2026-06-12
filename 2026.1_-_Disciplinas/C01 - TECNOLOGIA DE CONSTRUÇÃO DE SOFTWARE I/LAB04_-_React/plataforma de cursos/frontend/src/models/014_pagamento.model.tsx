import type { AssinaturaModel } from './013_assinatura.model.tsx';

export interface PagamentoModel {

  idPagamento: string;
  idAssinatura: string;
  idUsuario: string;
  assinatura?: AssinaturaModel;
  valor: number;
  dataPagamento: string;
  metodoPagamento: string;
  transacaoId: string;
  
}