class Trilha {
    constructor(ID_Trilha, Titulo, Descricao, ID_Categoria) {
        this.ID_Trilha = ID_Trilha // PK
        this.Titulo = Titulo
        this.Descricao = Descricao
        this.ID_Categoria = ID_Categoria // FK -> Categorias.ID_Categoria
    }
}
