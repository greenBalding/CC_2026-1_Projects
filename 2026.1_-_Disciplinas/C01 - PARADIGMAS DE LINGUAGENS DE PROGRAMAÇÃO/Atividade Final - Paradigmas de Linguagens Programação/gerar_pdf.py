# =============================================================
# Script para gerar o relatório em PDF usando fpdf2
# =============================================================

import os
from fpdf import FPDF

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class RelatorioPDF(FPDF):

    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(120, 120, 120)
            self.cell(0, 5, "Atividade Final - Paradigmas de Linguagens de Programacao", align="C")
            self.ln(8)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Pagina {self.page_no()}/{{nb}}", align="C")

    def titulo_secao(self, numero, texto):
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(0, 51, 102)
        self.ln(6)
        self.cell(0, 10, f"{numero}. {texto}", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(0, 51, 102)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(4)

    def titulo_subsecao(self, texto):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(51, 51, 51)
        self.ln(3)
        self.cell(0, 8, texto, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def texto(self, conteudo):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        self.set_x(self.l_margin)
        self.multi_cell(0, 5.5, conteudo)
        self.ln(2)

    def texto_negrito(self, conteudo):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(30, 30, 30)
        self.set_x(self.l_margin)
        self.multi_cell(0, 5.5, conteudo)
        self.ln(1)

    def codigo(self, caminho_arquivo):
        self.set_font("Courier", "", 7)
        self.set_text_color(0, 0, 0)
        self.set_fill_color(245, 245, 245)

        with open(caminho_arquivo, "r", encoding="utf-8") as f:
            linhas = f.readlines()

        for i, linha in enumerate(linhas, 1):
            linha_limpa = linha.rstrip("\n").replace("\t", "    ")
            # Sanitizar caracteres Unicode
            linha_limpa = sanitizar(linha_limpa)
            if len(linha_limpa) > 105:
                linha_limpa = linha_limpa[:102] + "..."
            texto_num = f"{i:3d} | {linha_limpa}"
            self.cell(0, 3.5, texto_num, new_x="LMARGIN", new_y="NEXT", fill=True)

        self.ln(3)

    def saida_console(self, texto_saida):
        self.set_font("Courier", "", 7.5)
        self.set_text_color(0, 80, 0)
        self.set_fill_color(240, 248, 240)

        for linha in texto_saida.strip().split("\n"):
            linha_limpa = sanitizar(linha.replace("\t", "    "))
            if len(linha_limpa) > 105:
                linha_limpa = linha_limpa[:102] + "..."
            self.cell(0, 4, linha_limpa, new_x="LMARGIN", new_y="NEXT", fill=True)

        self.ln(3)


def sanitizar(texto):
    """Remove/substitui caracteres Unicode nao suportados pelo Helvetica."""
    replacements = {
        "\u2192": "->",   # →
        "\u2014": "--",   # —
        "\u2013": "-",    # –
        "\u2018": "'",    # '
        "\u2019": "'",    # '
        "\u201c": '"',    # "
        "\u201d": '"',    # "
        "\u2022": "-",    # •
        "\u00e7": "c",    # ç
        "\u00e3": "a",    # ã
        "\u00e1": "a",    # á
        "\u00e9": "e",    # é
        "\u00ed": "i",    # í
        "\u00f3": "o",    # ó
        "\u00fa": "u",    # ú
        "\u00f4": "o",    # ô
        "\u00ea": "e",    # ê
        "\u00e2": "a",    # â
        "\u00c7": "C",    # Ç
        "\u00c3": "A",    # Ã
        "\u00c1": "A",    # Á
        "\u00c9": "E",    # É
        "\u00cd": "I",    # Í
        "\u00d3": "O",    # Ó
        "\u00da": "U",    # Ú
    }
    for char, repl in replacements.items():
        texto = texto.replace(char, repl)
    return texto


def gerar_pdf():
    pdf = RelatorioPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=20)

    # ===================== CAPA =====================
    pdf.add_page()
    pdf.ln(30)
    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 12, "Pontificia Universidade Catolica de Goias", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 13)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 8, "Escola Politecnica e de Artes", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, "Curso de Ciencia da Computacao", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(20)
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 12, "Atividade Final", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 16)
    pdf.cell(0, 10, "Paradigmas de Linguagens de Programacao", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "I", 12)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 8, "Sistema de Analise de Desempenho Academico", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(20)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, "Alunos:", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 12)
    for aluno in ["Amanda Barbosa Ferreira Agapito",
                   "Guilherme Jose da Silva",
                   "Matheus Silva Pains"]:
        pdf.cell(0, 7, aluno, align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(15)
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 7, "Professor: Roussian de Ramos Alves Gaioso", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)
    pdf.cell(0, 7, "Goiania, Goias", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, "12 de Junho de 2026", align="C", new_x="LMARGIN", new_y="NEXT")

    # ===================== SECAO 1 =====================
    pdf.add_page()
    pdf.titulo_secao("1", "Descricao do Problema")
    pdf.texto(
        "O sistema recebe dados de alunos contendo nome, matricula, tres notas e frequencia. "
        "A media e calculada como: media = (nota1 + nota2 + nota3) / 3. "
        "O aluno e aprovado se media >= 6.0 E frequencia >= 75%. Caso contrario, e reprovado."
    )
    pdf.titulo_subsecao("Dados de Entrada (alunos.csv)")
    pdf.saida_console(
        "Ana;2024001;8.0;7.5;9.0;85\n"
        "Bruno;2024002;5.0;6.0;4.5;80\n"
        "Carlos;2024003;7.0;6.5;8.0;60\n"
        "Daniela;2024004;9.0;9.5;10.0;95\n"
        "Eduardo;2024005;3.0;4.0;2.5;70\n"
        "Fernanda;2024006;6.0;6.0;6.0;75"
    )
    pdf.titulo_subsecao("Resultado Esperado")
    pdf.texto(
        "Ana: media 8.17, freq 85 -> Aprovado | Bruno: media 5.17, freq 80 -> Reprovado\n"
        "Carlos: media 7.17, freq 60 -> Reprovado | Daniela: media 9.50, freq 95 -> Aprovado\n"
        "Eduardo: media 3.17, freq 70 -> Reprovado | Fernanda: media 6.00, freq 75 -> Aprovado"
    )

    # ===================== SECAO 2 =====================
    pdf.titulo_secao("2", "Linguagens Escolhidas")
    pdf.texto(
        "- Python (imperativo) -- demonstra o paradigma procedural com variaveis, lacos while, "
        "condicionais e funcoes, sem classes ou funcoes de alta ordem.\n\n"
        "- Python (orientado a objetos) -- classes com encapsulamento (name mangling), metodos "
        "de negocio e organizacao em objetos.\n\n"
        "- Python (funcional) -- map, filter, reduce, lambdas e dicionarios imutaveis para "
        "um estilo predominantemente funcional.\n\n"
        "- Prolog (logico) -- linguagem declarativa baseada em fatos e regras.\n\n"
        "A escolha de Python para tres paradigmas isola o efeito do paradigma sem interferencia "
        "de diferencas sintaticas entre linguagens distintas. Prolog foi mantido por ser a "
        "referencia natural do paradigma logico."
    )

    # ===================== SECAO 3: IMPERATIVO =====================
    pdf.add_page()
    pdf.titulo_secao("3", "Parte 1 -- Implementacao Imperativa (Python)")
    pdf.titulo_subsecao("Codigo-fonte: parte1_imperativo.py")
    pdf.codigo(os.path.join(BASE_DIR, "parte1_imperativo.py"))

    pdf.titulo_subsecao("Saida da Execucao")
    pdf.saida_console(
        "======================================================================\n"
        "RELATORIO DE DESEMPENHO ACADEMICO -- VERSAO IMPERATIVA\n"
        "======================================================================\n"
        "Nome         Matricula    N1     N2     N3     Media    Freq   Situacao\n"
        "----------------------------------------------------------------------\n"
        "Ana          2024001      8.0    7.5    9.0    8.17     85     Aprovado\n"
        "Bruno        2024002      5.0    6.0    4.5    5.17     80     Reprovado\n"
        "Carlos       2024003      7.0    6.5    8.0    7.17     60     Reprovado\n"
        "Daniela      2024004      9.0    9.5    10.0   9.50     95     Aprovado\n"
        "Eduardo      2024005      3.0    4.0    2.5    3.17     70     Reprovado\n"
        "Fernanda     2024006      6.0    6.0    6.0    6.00     75     Aprovado\n"
        "----------------------------------------------------------------------\n"
        "Total de alunos: 6\n"
        "Aprovados: 3\n"
        "Reprovados: 3\n"
        "======================================================================"
    )

    # ===================== SECAO 4: OO =====================
    pdf.add_page()
    pdf.titulo_secao("4", "Parte 2 -- Implementacao Orientada a Objetos (Python)")
    pdf.titulo_subsecao("Codigo-fonte: parte2_oo.py")
    pdf.codigo(os.path.join(BASE_DIR, "parte2_oo.py"))

    pdf.titulo_subsecao("Saida da Execucao")
    pdf.saida_console(
        "======================================================================\n"
        "RELATORIO DE DESEMPENHO ACADEMICO -- VERSAO ORIENTADA A OBJETOS\n"
        "======================================================================\n"
        "Nome         Matricula    N1     N2     N3     Media    Freq   Situacao\n"
        "----------------------------------------------------------------------\n"
        "Ana          2024001      8.0    7.5    9.0    8.17     85     Aprovado\n"
        "Bruno        2024002      5.0    6.0    4.5    5.17     80     Reprovado\n"
        "Carlos       2024003      7.0    6.5    8.0    7.17     60     Reprovado\n"
        "Daniela      2024004      9.0    9.5    10.0   9.50     95     Aprovado\n"
        "Eduardo      2024005      3.0    4.0    2.5    3.17     70     Reprovado\n"
        "Fernanda     2024006      6.0    6.0    6.0    6.00     75     Aprovado\n"
        "----------------------------------------------------------------------\n"
        "Total de alunos: 6\n"
        "Aprovados: 3\n"
        "Reprovados: 3\n"
        "======================================================================"
    )

    # ===================== SECAO 5: FUNCIONAL =====================
    pdf.add_page()
    pdf.titulo_secao("5", "Parte 3 -- Implementacao Funcional (Python)")
    pdf.titulo_subsecao("Codigo-fonte: parte3_funcional.py")
    pdf.codigo(os.path.join(BASE_DIR, "parte3_funcional.py"))

    pdf.titulo_subsecao("Saida da Execucao")
    pdf.saida_console(
        "======================================================================\n"
        "RELATORIO DE DESEMPENHO ACADEMICO -- VERSAO FUNCIONAL\n"
        "======================================================================\n"
        "Nome         Matricula    N1     N2     N3     Media    Freq   Situacao\n"
        "----------------------------------------------------------------------\n"
        "Ana          2024001      8.0    7.5    9.0    8.17     85     Aprovado\n"
        "Bruno        2024002      5.0    6.0    4.5    5.17     80     Reprovado\n"
        "Carlos       2024003      7.0    6.5    8.0    7.17     60     Reprovado\n"
        "Daniela      2024004      9.0    9.5    10.0   9.50     95     Aprovado\n"
        "Eduardo      2024005      3.0    4.0    2.5    3.17     70     Reprovado\n"
        "Fernanda     2024006      6.0    6.0    6.0    6.00     75     Aprovado\n"
        "----------------------------------------------------------------------\n"
        "Total de alunos: 6\n"
        "Aprovados: 3\n"
        "Reprovados: 3\n"
        "======================================================================\n"
        "\n"
        "--- Alunos Aprovados (via filter) ---\n"
        "  Ana -- Media: 8.17\n"
        "  Daniela -- Media: 9.50\n"
        "  Fernanda -- Media: 6.00"
    )

    # ===================== SECAO 6: LOGICO =====================
    pdf.add_page()
    pdf.titulo_secao("6", "Parte 4 -- Implementacao Logica (Prolog)")
    pdf.titulo_subsecao("Codigo-fonte: parte4_logico.pl")
    pdf.codigo(os.path.join(BASE_DIR, "parte4_logico.pl"))

    pdf.titulo_subsecao("Exemplo de Consultas e Saida")
    pdf.saida_console(
        "?- aprovado(X).\n"
        "X = ana ;\n"
        "X = daniela ;\n"
        "X = fernanda.\n"
        "\n"
        "?- reprovado(X).\n"
        "X = bruno ;\n"
        "X = carlos ;\n"
        "X = eduardo.\n"
        "\n"
        "?- situacao(ana, Mat, Media, Freq, Sit).\n"
        "Mat = 2024001, Media = 8.166666666666666, Freq = 85, Sit = aprovado.\n"
        "\n"
        "?- relatorio.\n"
        "============================================\n"
        "RELATORIO - VERSAO LOGICA (PROLOG)\n"
        "============================================\n"
        "ana | 2024001 | Media: 8.17 | Freq: 85 | aprovado\n"
        "bruno | 2024002 | Media: 5.17 | Freq: 80 | reprovado\n"
        "carlos | 2024003 | Media: 7.17 | Freq: 60 | reprovado\n"
        "daniela | 2024004 | Media: 9.50 | Freq: 95 | aprovado\n"
        "eduardo | 2024005 | Media: 3.17 | Freq: 70 | reprovado\n"
        "fernanda | 2024006 | Media: 6.00 | Freq: 75 | aprovado\n"
        "============================================\n"
        "true."
    )

    # ===================== SECAO 7: LEGIBILIDADE =====================
    pdf.add_page()
    pdf.titulo_secao("7", "Comparacao de Legibilidade")

    pdf.texto_negrito("Clareza dos nomes:")
    pdf.texto("Todas as versoes Python usam nomes descritivos em portugues. Prolog usa atomos curtos (ana, aprovado), concisos mas claros.")

    pdf.texto_negrito("Organizacao:")
    pdf.texto("A OO e a mais organizada: dados e logica encapsulados em classes. A funcional separa entrada/processamento/saida. A imperativa e linear e direta.")

    pdf.texto_negrito("Detalhes sintaticos:")
    pdf.texto("Prolog tem a menor quantidade de sintaxe. Python imperativo exige mais linhas por usar while e indices explicitos.")

    pdf.texto_negrito("Fluxo do programa:")
    pdf.texto("A imperativa e a mais facil de seguir passo a passo. A funcional exige entender composicao de funcoes. Prolog nao tem fluxo explicito.")

    pdf.texto_negrito("Localizacao das regras:")
    pdf.texto("Em Prolog, cada regra e uma clausula isolada. Na OO, estao nos metodos. Na funcional, em funcoes nomeadas.")

    pdf.set_font("Helvetica", "BI", 10)
    pdf.set_text_color(0, 51, 102)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5.5, "Conclusao: Para iniciantes, a imperativa e mais legivel. Para projetos maiores, a OO oferece melhor organizacao. Prolog e o mais conciso, mas exige familiaridade.")
    pdf.ln(4)

    # ===================== SECAO 8: FACILIDADE DE ESCRITA =====================
    pdf.titulo_secao("8", "Comparacao de Facilidade de Escrita")

    pdf.texto_negrito("Quantidade de codigo:")
    pdf.texto("Prolog: ~40 linhas. Funcional: ~70 linhas. Imperativa: ~80 linhas. OO: ~100 linhas.")

    pdf.texto_negrito("Dificuldade sintatica:")
    pdf.texto("Python e uniforme nos tres paradigmas. Prolog exige aprender unificacao e backtracking.")

    pdf.texto_negrito("Manipulacao de listas:")
    pdf.texto("A funcional e a mais natural com map/filter. A imperativa usa indices manuais. A OO itera com for.")

    pdf.texto_negrito("Estruturas auxiliares:")
    pdf.texto("A OO exige criar classes. A funcional usa dicionarios. A imperativa usa listas de listas. Prolog usa fatos diretamente.")

    pdf.set_font("Helvetica", "BI", 10)
    pdf.set_text_color(0, 51, 102)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5.5, "Conclusao: A funcional Python foi a mais rapida de implementar. Prolog e conciso, mas exige mudanca de mentalidade.")
    pdf.ln(4)

    # ===================== SECAO 9: CONFIABILIDADE =====================
    pdf.titulo_secao("9", "Comparacao de Confiabilidade")

    pdf.texto_negrito("Verificacao de tipos:")
    pdf.texto("Python tem tipagem dinamica -- erros de tipo so aparecem em tempo de execucao. Prolog nao tem tipos explicitos.")

    pdf.texto_negrito("Erros em tempo de execucao:")
    pdf.texto("A imperativa e mais suscetivel a erros de indice (alunos[i][5]). A OO protege dados com encapsulamento. A funcional reduz efeitos colaterais com funcoes puras.")

    pdf.texto_negrito("Acesso a memoria:")
    pdf.texto("Python e Prolog nao permitem acesso direto a memoria, eliminando riscos de buffer overflow (diferente de C).")

    pdf.texto_negrito("Testabilidade:")
    pdf.texto("A funcional e a mais testavel: funcoes puras podem ser testadas isoladamente. A OO permite testes por metodo.")

    pdf.set_font("Helvetica", "BI", 10)
    pdf.set_text_color(0, 51, 102)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5.5, "Conclusao: A funcional oferece maior confiabilidade por funcoes puras. A OO vem em segundo pelo encapsulamento.")
    pdf.ln(4)

    # ===================== SECAO 10: NOMES, ESCOPO, TEMPO DE VIDA =====================
    pdf.add_page()
    pdf.titulo_secao("10", "Comparacao sobre Nomes, Escopo e Tempo de Vida")

    pdf.titulo_subsecao("Versao Imperativa")
    pdf.texto(
        "Nomes declarados: caminho_arquivo, lista_alunos (globais); nome, media, i (locais).\n"
        "Visibilidade: globais visiveis em todo o modulo; locais apenas dentro de suas funcoes.\n"
        "Escopo: funcoes como calcular_media() tem escopo local; parametros nao vazam.\n"
        "Tempo de vida: locais criadas na chamada e destruidas ao retornar; globais existem durante toda a execucao."
    )

    pdf.titulo_subsecao("Versao Orientada a Objetos")
    pdf.texto(
        "Nomes declarados: classes Aluno e Turma; atributos self.__nome, self.__nota1; metodos calcular_media().\n"
        "Visibilidade: atributos com __ (name mangling) visiveis apenas dentro da classe; metodos publicos acessiveis externamente.\n"
        "Escopo: cada objeto tem seu proprio escopo de atributos; metodos acessam self.\n"
        "Tempo de vida: objetos existem enquanto houver referencia; garbage collector os destroi quando sem referencias."
    )

    pdf.titulo_subsecao("Versao Funcional")
    pdf.texto(
        "Nomes declarados: funcoes puras calcular_media(), verificar_aprovacao(), gerar_resultado(); variavel alunos no modulo.\n"
        "Visibilidade: cada funcao ve apenas seus parametros e variaveis locais. Sem estado mutavel compartilhado.\n"
        "Escopo: funcoes sao de escopo global; lambdas em filter() capturam variaveis do escopo envolvente (closure).\n"
        "Tempo de vida: dados criados a cada chamada e descartados apos retorno; listas intermediarias vivem no escopo do modulo."
    )

    pdf.titulo_subsecao("Versao Logica (Prolog)")
    pdf.texto(
        "Nomes declarados: predicados aluno/6, media/2, aprovado/1; variaveis logicas Nome, Media.\n"
        "Visibilidade: fatos e regras sao globais; variaveis logicas existem apenas dentro de sua clausula.\n"
        "Escopo: cada clausula e independente; a variavel Nome em aprovado(Nome) so existe naquela regra.\n"
        "Tempo de vida: variaveis instanciadas durante unificacao e deixam de existir ao termino da consulta ou backtracking."
    )

    # ===================== SECAO 11: TIPOS DE DADOS =====================
    pdf.titulo_secao("11", "Comparacao sobre Tipos de Dados")

    pdf.titulo_subsecao("Python (3 versoes)")
    pdf.texto(
        "Tipagem: dinamica e forte.\n"
        "Tipos primitivos: int, float, str, bool.\n"
        "Strings: tipo nativo str, imutavel.\n"
        "Colecoes: listas, dicionarios, tuplas.\n"
        "Objetos: sim (versao OO com classes Aluno e Turma).\n"
        "Conversao de tipo: explicita com float(), int().\n"
        "Erros de tipo: TypeError em tempo de execucao."
    )

    pdf.titulo_subsecao("Prolog")
    pdf.texto(
        "Tipagem: sem tipos explicitos.\n"
        "Tipos primitivos: atomos, numeros, variaveis logicas.\n"
        "Strings: representadas como atomos (ana, bruno).\n"
        "Colecoes: listas Prolog e termos compostos.\n"
        "Objetos: nao existe o conceito.\n"
        "Conversao de tipo: automatica via operador is.\n"
        "Erros de tipo: falha na unificacao (nao gera excecao, apenas falha)."
    )

    # ===================== SECAO 12: COMPARACAO PARADIGMAS =====================
    pdf.add_page()
    pdf.titulo_secao("12", "Comparacao entre os Paradigmas")

    perguntas = [
        ("Como a versao imperativa organiza a solucao?",
         "Sequencialmente: le dados, percorre com laco while, calcula media, verifica condicao, imprime. O programador controla cada passo."),
        ("Como a versao orientada a objetos organiza a solucao?",
         "Modela o dominio: Aluno encapsula dados e comportamento, Turma gerencia a colecao. A logica e distribuida em metodos."),
        ("Como a versao funcional organiza a solucao?",
         "Como pipeline de transformacoes: ler_dados -> map(gerar_resultado) -> imprimir_relatorio. Dados fluem entre funcoes puras."),
        ("Como a versao declarativa organiza a solucao?",
         "Declara fatos (dados dos alunos) e regras (media, aprovacao). O motor de inferencia de Prolog encontra as respostas."),
        ("Qual versao ficou mais proxima da forma humana?",
         "Prolog. A regra aprovado(Nome) :- media(Nome, M), M >= 6.0 e quase linguagem natural."),
        ("Qual versao ficou mais proxima da maquina?",
         "A imperativa. O laco while com indice manual e atribuicoes explicitas reflete como o processador executa instrucoes."),
        ("Qual versao parece mais adequada para esse problema?",
         "A funcional. O problema e essencialmente uma transformacao de dados (entrada -> processamento -> saida), caso ideal do paradigma funcional."),
    ]

    for pergunta, resposta in perguntas:
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(0, 51, 102)
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(0, 5.5, pergunta)
        pdf.texto(resposta)

    # ===================== SECAO 13: CONCLUSAO =====================
    pdf.titulo_secao("13", "Conclusao")
    pdf.texto(
        "Cada paradigma demonstrou forcas e limitacoes claras ao resolver o mesmo problema:"
    )
    pdf.texto(
        "O paradigma imperativo e o mais intuitivo para iniciantes e oferece controle total sobre o fluxo, "
        "mas gera codigo mais verboso e propenso a erros de indice."
    )
    pdf.texto(
        "O paradigma orientado a objetos brilha em organizacao e manutenibilidade. Encapsulamento protege "
        "os dados e facilita extensoes futuras (ex.: adicionar novos tipos de aluno). E o mais adequado para sistemas grandes."
    )
    pdf.texto(
        "O paradigma funcional produziu o codigo mais conciso e testavel. Funcoes puras sem efeito colateral "
        "facilitam depuracao e paralelismo. E ideal para problemas de transformacao de dados."
    )
    pdf.texto(
        "O paradigma logico e o mais declarativo e conciso. O programador descreve o que quer, nao como fazer. "
        "E poderoso para regras de negocio e sistemas especialistas, mas limitado para I/O e interfaces."
    )
    pdf.texto(
        "Nao existe paradigma universalmente \"melhor\". A escolha depende do problema: sistemas corporativos "
        "favorecem OO; pipelines de dados favorecem funcional; regras de inferencia favorecem logico; "
        "scripts simples favorecem imperativo. O programador competente domina multiplos paradigmas e "
        "escolhe o mais adequado para cada situacao."
    )

    # ===== Salvar =====
    caminho_pdf = os.path.join(BASE_DIR, "relatorio.pdf")
    pdf.output(caminho_pdf)
    print(f"PDF gerado com sucesso: {caminho_pdf}")


if __name__ == "__main__":
    gerar_pdf()
