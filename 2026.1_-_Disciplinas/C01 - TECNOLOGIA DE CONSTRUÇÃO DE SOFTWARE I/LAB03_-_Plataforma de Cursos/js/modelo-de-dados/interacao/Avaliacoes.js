class Avaliacao {
    constructor(ID_Avaliacao, ID_Usuario, ID_Curso, Nota, Comentario, DataAvaliacao) {
        this.ID_Avaliacao = ID_Avaliacao // PK
        this.ID_Usuario = ID_Usuario // FK -> Usuarios.ID_Usuario
        this.ID_Curso = ID_Curso // FK -> Cursos.ID_Curso
        this.Nota = Nota // Ex: 1 a 5
        this.Comentario = Comentario // Núlável
        this.DataAvaliacao = DataAvaliacao
    }
}
