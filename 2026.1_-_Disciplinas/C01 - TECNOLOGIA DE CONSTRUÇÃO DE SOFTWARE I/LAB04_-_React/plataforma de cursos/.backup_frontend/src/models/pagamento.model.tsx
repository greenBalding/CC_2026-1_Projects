import type { AssinaturaModel } from './assinatura.model.tsx';

export interface PagamentoModel {
  idPagamento: string;
  idAssinatura: string;
  assinatura?: AssinaturaModel;
  valorPago: number;
  dataPagamento: string;
  metodoPagamento: string;
  idTransacaoGateway: string;
  dataFim: string;
}