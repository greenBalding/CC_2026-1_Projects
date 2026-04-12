class Usuario {
    constructor(ID_Usuario, NomeCompleto, Email, SenhaHash, DataCadastro, TipoUsuario = "aluno") {
        this.ID_Usuario = ID_Usuario // PK
        this.NomeCompleto = NomeCompleto // Unique
        this.Email = Email // Unique
        this.SenhaHash = SenhaHash
        this.DataCadastro = DataCadastro
        // Eu não achei outra forma de fazer a diferenciação entre admin e aluno, então adicionei esse campo. Ele existe pra controlar o acesso a certas páginas e funcionalidades da plataforma de cursos
        this.TipoUsuario = TipoUsuario // "aluno" ou "admin"
    }
}

if (typeof window !== "undefined") {
    window.Usuario = Usuario
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = Usuario
}
