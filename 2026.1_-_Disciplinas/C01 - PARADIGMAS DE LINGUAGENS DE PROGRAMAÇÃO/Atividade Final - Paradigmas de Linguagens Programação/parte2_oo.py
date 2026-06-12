# Parte 2 - Implementacao Orientada a Objetos (Python)
# Sistema de Analise de Desempenho Academico

import os


class Aluno:
    def __init__(self, nome, matricula, nota1, nota2, nota3, frequencia):
        self.nome = nome
        self.matricula = matricula
        self.nota1 = nota1
        self.nota2 = nota2
        self.nota3 = nota3
        self.frequencia = frequencia

    def calcular_media(self):
        return (self.nota1 + self.nota2 + self.nota3) / 3

    def verificar_aprovacao(self):
        media = self.calcular_media()
        if media >= 6.0 and self.frequencia >= 75:
            return "Aprovado"
        else:
            return "Reprovado"


class Turma:
    def __init__(self):
        self.alunos = []

    def carregar_arquivo(self, caminho):
        arquivo = open(caminho, "r", encoding="utf-8")
        for linha in arquivo:
            linha = linha.strip()
            if linha == "":
                continue
            partes = linha.split(";")
            aluno = Aluno(
                partes[0],
                partes[1],
                float(partes[2]),
                float(partes[3]),
                float(partes[4]),
                int(partes[5])
            )
            self.alunos.append(aluno)
        arquivo.close()

    def gerar_relatorio(self):
        print("=" * 70)
        print("RELATORIO DE DESEMPENHO ACADEMICO - VERSAO OO (Python)")
        print("=" * 70)
        print(f"{'Nome':<12} {'Matricula':<12} {'N1':<6} {'N2':<6} {'N3':<6} {'Media':<8} {'Freq':<6} {'Situacao'}")
        print("-" * 70)

        aprovados = 0
        reprovados = 0

        for aluno in self.alunos:
            media = aluno.calcular_media()
            situacao = aluno.verificar_aprovacao()
            print(f"{aluno.nome:<12} {aluno.matricula:<12} {aluno.nota1:<6.1f} {aluno.nota2:<6.1f} {aluno.nota3:<6.1f} {media:<8.2f} {aluno.frequencia:<6} {situacao}")

            if situacao == "Aprovado":
                aprovados += 1
            else:
                reprovados += 1

        print("-" * 70)
        print(f"Total de alunos: {len(self.alunos)}")
        print(f"Aprovados: {aprovados}")
        print(f"Reprovados: {reprovados}")
        print("=" * 70)


# Programa principal
caminho = os.path.join(os.path.dirname(os.path.abspath(__file__)), "alunos.csv")
turma = Turma()
turma.carregar_arquivo(caminho)
turma.gerar_relatorio()
