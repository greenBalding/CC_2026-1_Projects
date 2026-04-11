class Progresso_Aula {
    constructor(ID_Usuario, ID_Aula, DataConclusao, Status) {
        this.ID_Usuario = ID_Usuario // PK/FK -> Usuarios.ID_Usuario
        this.ID_Aula = ID_Aula // PK/FK -> Aulas.ID_Aula
        this.DataConclusao = DataConclusao
        this.Status = Status // Ex: Concluído, Em Progresso, Não Iniciado, ...
    }
}
