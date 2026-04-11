class Trilha_Curso {
    constructor(ID_Trilha, ID_Curso, Ordem) {
        this.ID_Trilha = ID_Trilha // PK/FK -> Trilhas.ID_Trilha
        this.ID_Curso = ID_Curso // PK/FK -> Cursos.ID_Curso
        this.Ordem = Ordem // Para sequenciar os cursos dentro da trilha (1, 2, 3, ...)
    }
}
