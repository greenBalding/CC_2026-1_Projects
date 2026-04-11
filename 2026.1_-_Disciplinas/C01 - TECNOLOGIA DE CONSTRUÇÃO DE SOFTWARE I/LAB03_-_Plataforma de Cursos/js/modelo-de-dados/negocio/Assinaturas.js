class Assinatura {
    constructor(ID_Assinatura, ID_Usuario, ID_Plano, DataInicio, DataFim) {
        this.ID_Assinatura = ID_Assinatura // PK
        this.ID_Usuario = ID_Usuario // FK -> Usuarios.ID_Usuario, not Null
        this.ID_Plano = ID_Plano // FK -> Planos.ID_Plano, not Null
        this.DataInicio = DataInicio // not Null
        this.DataFim = DataFim // not Null
    }
}
