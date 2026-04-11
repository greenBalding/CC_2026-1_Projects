class Curso {
    constructor(ID_Curso, Titulo, Descricao, ID_Instrutor, ID_Categoria, Nivel, DataPublicacao, TotalAulas, TotalHoras) {
        this.ID_Curso = ID_Curso // PK
        this.Titulo = Titulo
        this.Descricao = Descricao
        this.ID_Instrutor = ID_Instrutor // FK -> Usuarios.ID_Usuario
        this.ID_Categoria = ID_Categoria // FK -> Categorias.ID_Categoria
        this.Nivel = Nivel // Ex: Iniciante, Intermediário, Avançado
        this.DataPublicacao = DataPublicacao
        this.TotalAulas = TotalAulas
        this.TotalHoras = TotalHoras
    }
}
