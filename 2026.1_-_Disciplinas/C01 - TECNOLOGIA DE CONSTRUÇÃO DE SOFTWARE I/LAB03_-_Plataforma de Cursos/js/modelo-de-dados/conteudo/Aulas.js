class Aula {
    constructor(ID_Aula, ID_Modulo, Titulo, TipoConteudo, URL_Conteudo, DuracaoMinutos, Ordem) {
        this.ID_Aula = ID_Aula // PK
        this.ID_Modulo = ID_Modulo // FK -> Modulos.ID_Modulo
        this.Titulo = Titulo
        this.TipoConteudo = TipoConteudo // Ex: Vídeo, Texto, Quiz, ...
        this.URL_Conteudo = URL_Conteudo
        this.DuracaoMinutos = DuracaoMinutos
        this.Ordem = Ordem // Para sequenciar as aulas dentro do módulo (1, 2, 3, ...)
    }
}
