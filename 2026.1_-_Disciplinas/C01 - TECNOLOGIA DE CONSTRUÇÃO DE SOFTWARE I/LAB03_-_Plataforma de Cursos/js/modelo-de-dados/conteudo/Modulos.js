class Modulo {
    constructor(ID_Modulo, ID_Curso, Titulo, Ordem) {
        this.ID_Modulo = ID_Modulo // PK
        this.ID_Curso = ID_Curso // FK -> Cursos.ID_Curso
        this.Titulo = Titulo
        this.Ordem = Ordem // Para sequenciar os módulos dentro do curso (1, 2, 3, ...)
    }
}
