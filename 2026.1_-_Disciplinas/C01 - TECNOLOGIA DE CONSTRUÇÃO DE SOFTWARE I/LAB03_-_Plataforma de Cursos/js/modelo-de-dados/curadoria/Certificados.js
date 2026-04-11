class Certificado {
    constructor(ID_Certificado, ID_Usuario, ID_Curso, ID_Trilha, CodigoVerificacao, DataEmissao) {
        this.ID_Certificado = ID_Certificado // PK
        this.ID_Usuario = ID_Usuario // FK -> Usuarios.ID_Usuario
        this.ID_Curso = ID_Curso // FK -> Cursos.ID_Curso
        this.ID_Trilha = ID_Trilha // FK -> Trilhas.ID_Trilha, Null
        this.CodigoVerificacao = CodigoVerificacao // Unique
        this.DataEmissao = DataEmissao
    }
}
