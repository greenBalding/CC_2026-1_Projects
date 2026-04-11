class Pagamento {
    constructor(ID_Pagamento, ID_Assinatura, ValorPago, DataPagamento, MetodoPagamento, Id_Transacao_Gateway, DataFim) {
        this.ID_Pagamento = ID_Pagamento // PK
        this.ID_Assinatura = ID_Assinatura // FK -> Assinaturas.ID_Assinatura, not Null
        this.ValorPago = ValorPago // FK -> Planos.Preco, not Null
        this.DataPagamento = DataPagamento // not Null
        this.MetodoPagamento = MetodoPagamento // not Null
        this.Id_Transacao_Gateway = Id_Transacao_Gateway // not Null
        this.DataFim = DataFim // not Null
    }
}
