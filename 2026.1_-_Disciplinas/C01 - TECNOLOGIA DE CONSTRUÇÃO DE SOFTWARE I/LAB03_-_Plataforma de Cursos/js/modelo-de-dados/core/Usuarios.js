class Usuario {
    constructor(ID_Usuario, NomeCompleto, Email, SenhaHash, DataCadastro) {
        this.ID_Usuario = ID_Usuario // PK
        this.NomeCompleto = NomeCompleto // Unique
        this.Email = Email // Unique
        this.SenhaHash = SenhaHash
        this.DataCadastro = DataCadastro
    }
}
