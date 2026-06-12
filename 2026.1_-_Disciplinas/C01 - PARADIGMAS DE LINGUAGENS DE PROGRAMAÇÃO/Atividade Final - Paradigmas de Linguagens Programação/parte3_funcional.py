# Parte 3 - Implementacao Funcional (Python)
# Sistema de Analise de Desempenho Academico

import os
from functools import reduce


# Funcoes puras

def parse_linha(linha):
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
    return (aluno["nota1"] + aluno["nota2"] + aluno["nota3"]) / 3


def verificar_aprovacao(aluno):
    return calcular_media(aluno) >= 6.0 and aluno["frequencia"] >= 75


def gerar_resultado(aluno):
    media = calcular_media(aluno)
    situacao = "Aprovado" if verificar_aprovacao(aluno) else "Reprovado"
    return {
        "nome": aluno["nome"],
        "matricula": aluno["matricula"],
        "nota1": aluno["nota1"],
        "nota2": aluno["nota2"],
        "nota3": aluno["nota3"],
        "frequencia": aluno["frequencia"],
        "media": media,
        "situacao": situacao
    }


def contar_situacao(acc, r):
    if r["situacao"] == "Aprovado":
        return (acc[0] + 1, acc[1])
    else:
        return (acc[0], acc[1] + 1)


# Entrada
caminho = os.path.join(os.path.dirname(os.path.abspath(__file__)), "alunos.csv")
arquivo = open(caminho, "r", encoding="utf-8")
linhas = arquivo.readlines()
arquivo.close()

alunos = list(map(parse_linha, filter(lambda l: l.strip() != "", linhas)))

# Processamento com map
resultados = list(map(gerar_resultado, alunos))

# Filter para separar aprovados
aprovados = list(filter(lambda r: r["situacao"] == "Aprovado", resultados))

# Saida
print("=" * 70)
print("RELATORIO DE DESEMPENHO ACADEMICO - VERSAO FUNCIONAL (Python)")
print("=" * 70)
print(f"{'Nome':<12} {'Matricula':<12} {'N1':<6} {'N2':<6} {'N3':<6} {'Media':<8} {'Freq':<6} {'Situacao'}")
print("-" * 70)

for r in resultados:
    print(f"{r['nome']:<12} {r['matricula']:<12} {r['nota1']:<6.1f} {r['nota2']:<6.1f} {r['nota3']:<6.1f} {r['media']:<8.2f} {r['frequencia']:<6} {r['situacao']}")

# Reduce para contar
total_aprov, total_reprov = reduce(contar_situacao, resultados, (0, 0))

print("-" * 70)
print(f"Total de alunos: {len(resultados)}")
print(f"Aprovados: {total_aprov}")
print(f"Reprovados: {total_reprov}")
print("=" * 70)

print("\n--- Aprovados (via filter) ---")
for a in aprovados:
    print(f"  {a['nome']} - Media: {a['media']:.2f}")
