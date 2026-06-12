# =============================================================
# Parte 1 — Implementação Imperativa
# Sistema de Análise de Desempenho Acadêmico
# Paradigma: Imperativo/Procedural (Python)
# =============================================================

import os

# ----- Funções procedurais -----

def ler_arquivo(caminho):
    """Lê o arquivo CSV e retorna uma lista de listas com os dados."""
    alunos = []
    arquivo = open(caminho, "r", encoding="utf-8")
    linhas = arquivo.readlines()
    arquivo.close()

    i = 0
    while i < len(linhas):
        linha = linhas[i].strip()
        if linha != "":
            partes = linha.split(";")
            nome = partes[0]
            matricula = partes[1]
            nota1 = float(partes[2])
            nota2 = float(partes[3])
            nota3 = float(partes[4])
            frequencia = int(partes[5])
            alunos.append([nome, matricula, nota1, nota2, nota3, frequencia])
        i = i + 1

    return alunos


def calcular_media(nota1, nota2, nota3):
    """Calcula a média aritmética de três notas."""
    media = (nota1 + nota2 + nota3) / 3
    return media


def verificar_aprovacao(media, frequencia):
    """Retorna 'Aprovado' ou 'Reprovado' com base na média e frequência."""
    if media >= 6.0 and frequencia >= 75:
        situacao = "Aprovado"
    else:
        situacao = "Reprovado"
    return situacao


def gerar_relatorio(alunos):
    """Percorre a lista de alunos, calcula médias e imprime o relatório."""
    print("=" * 70)
    print("RELATÓRIO DE DESEMPENHO ACADÊMICO — VERSÃO IMPERATIVA")
    print("=" * 70)
    print(f"{'Nome':<12} {'Matrícula':<12} {'N1':<6} {'N2':<6} {'N3':<6} {'Média':<8} {'Freq':<6} {'Situação'}")
    print("-" * 70)

    total_aprovados = 0
    total_reprovados = 0

    i = 0
    while i < len(alunos):
        nome = alunos[i][0]
        matricula = alunos[i][1]
        nota1 = alunos[i][2]
        nota2 = alunos[i][3]
        nota3 = alunos[i][4]
        frequencia = alunos[i][5]

        media = calcular_media(nota1, nota2, nota3)
        situacao = verificar_aprovacao(media, frequencia)

        if situacao == "Aprovado":
            total_aprovados = total_aprovados + 1
        else:
            total_reprovados = total_reprovados + 1

        print(f"{nome:<12} {matricula:<12} {nota1:<6.1f} {nota2:<6.1f} {nota3:<6.1f} {media:<8.2f} {frequencia:<6} {situacao}")

        i = i + 1

    print("-" * 70)
    print(f"Total de alunos: {len(alunos)}")
    print(f"Aprovados: {total_aprovados}")
    print(f"Reprovados: {total_reprovados}")
    print("=" * 70)


# ----- Programa principal -----

caminho_arquivo = os.path.join(os.path.dirname(os.path.abspath(__file__)), "alunos.csv")
lista_alunos = ler_arquivo(caminho_arquivo)
gerar_relatorio(lista_alunos)
