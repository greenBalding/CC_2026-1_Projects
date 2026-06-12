# =============================================================
# Parte 3 — Implementação Funcional
# Sistema de Análise de Desempenho Acadêmico
# Paradigma: Funcional (Python)
# =============================================================

import os
from functools import reduce


# ----- Funções puras -----

def parse_linha(linha):
    """Converte uma linha CSV em um dicionário imutável de dados do aluno."""
    partes = linha.strip().split(";")
    return {
        "nome": partes[0],
        "matricula": partes[1],
        "nota1": float(partes[2]),
        "nota2": float(partes[3]),
        "nota3": float(partes[4]),
        "frequencia": int(partes[5])
    }


def calcular_media(aluno):
    """Função pura: retorna a média aritmética das três notas."""
    return (aluno["nota1"] + aluno["nota2"] + aluno["nota3"]) / 3


def verificar_aprovacao(aluno):
    """Função pura: retorna True se o aluno está aprovado."""
    return calcular_media(aluno) >= 6.0 and aluno["frequencia"] >= 75


def gerar_resultado(aluno):
    """Função pura: retorna um novo dicionário com média e situação adicionados."""
    media = calcular_media(aluno)
    situacao = "Aprovado" if verificar_aprovacao(aluno) else "Reprovado"
    return {**aluno, "media": media, "situacao": situacao}


def contar_por_situacao(acumulador, resultado):
    """Função para reduce: conta aprovados e reprovados."""
    if resultado["situacao"] == "Aprovado":
        return (acumulador[0] + 1, acumulador[1])
    else:
        return (acumulador[0], acumulador[1] + 1)


# ----- Entrada -----

def ler_dados(caminho):
    """Lê o arquivo e retorna lista de dicionários (separação entrada/processamento)."""
    with open(caminho, "r", encoding="utf-8") as arquivo:
        linhas = arquivo.readlines()
    return list(map(parse_linha, filter(lambda l: l.strip() != "", linhas)))


# ----- Saída -----

def imprimir_relatorio(resultados):
    """Imprime o relatório formatado (separação de saída)."""
    print("=" * 70)
    print("RELATÓRIO DE DESEMPENHO ACADÊMICO — VERSÃO FUNCIONAL")
    print("=" * 70)
    print(f"{'Nome':<12} {'Matrícula':<12} {'N1':<6} {'N2':<6} {'N3':<6} {'Média':<8} {'Freq':<6} {'Situação'}")
    print("-" * 70)

    for r in resultados:
        print(f"{r['nome']:<12} {r['matricula']:<12} "
              f"{r['nota1']:<6.1f} {r['nota2']:<6.1f} {r['nota3']:<6.1f} "
              f"{r['media']:<8.2f} {r['frequencia']:<6} {r['situacao']}")

    aprovados, reprovados = reduce(contar_por_situacao, resultados, (0, 0))

    print("-" * 70)
    print(f"Total de alunos: {len(resultados)}")
    print(f"Aprovados: {aprovados}")
    print(f"Reprovados: {reprovados}")
    print("=" * 70)


# ----- Pipeline funcional -----

caminho = os.path.join(os.path.dirname(os.path.abspath(__file__)), "alunos.csv")

# Entrada
alunos = ler_dados(caminho)

# Processamento (map aplica gerar_resultado a cada aluno)
resultados = list(map(gerar_resultado, alunos))

# Exemplo de filter: listar apenas aprovados
aprovados = list(filter(lambda r: r["situacao"] == "Aprovado", resultados))

# Saída
imprimir_relatorio(resultados)

print("\n--- Alunos Aprovados (via filter) ---")
for a in aprovados:
    print(f"  {a['nome']} — Média: {a['media']:.2f}")
