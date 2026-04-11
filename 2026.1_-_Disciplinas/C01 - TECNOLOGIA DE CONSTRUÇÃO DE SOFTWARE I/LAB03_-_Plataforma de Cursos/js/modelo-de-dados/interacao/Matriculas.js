class Matricula {
    constructor(ID_Matricula, ID_Usuario, ID_Curso, DataMatricula, DataConclusao) {
        this.ID_Matricula = ID_Matricula // PK
        this.ID_Usuario = ID_Usuario // FK -> Usuarios.ID_Usuario
        this.ID_Curso = ID_Curso // FK -> Cursos.ID_Curso
        this.DataMatricula = DataMatricula // Quando o usuário se matricula no curso
        this.DataConclusao = DataConclusao // Nulável (Preenchida quando o usuário concluir o curso)
    }
}
