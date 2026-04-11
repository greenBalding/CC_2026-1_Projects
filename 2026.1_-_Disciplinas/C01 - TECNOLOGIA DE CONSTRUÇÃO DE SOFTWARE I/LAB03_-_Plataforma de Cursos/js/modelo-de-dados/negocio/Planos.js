class Plano {
    constructor(ID_Plano, Nome, Descricao, Preco, DuracaoMeses) {
        this.ID_Plano = ID_Plano // PK
        this.Nome = Nome // not Null
        this.Descricao = Descricao
        this.Preco = Preco // not Null
        this.DuracaoMeses = DuracaoMeses // not Null
    }
}
