# =============================================================
# Parte 2 — Implementação Orientada a Objetos
# Sistema de Análise de Desempenho Acadêmico
# Paradigma: Orientado a Objetos (Python)
# =============================================================

import os


class Aluno:
    """Representa um aluno com seus dados acadêmicos."""

    def __init__(self, nome, matricula, nota1, nota2, nota3, frequencia):
        self.__nome = nome
        self.__matricula = matricula
        self.__nota1 = nota1
        self.__nota2 = nota2
        self.__nota3 = nota3
        self.__frequencia = frequencia

    # ----- Getters (encapsulamento) -----

    def get_nome(self):
        return self.__nome

    def get_matricula(self):
        return self.__matricula

    def get_nota1(self):
        return self.__nota1

    def get_nota2(self):
        return self.__nota2

    def get_nota3(self):
        return self.__nota3

    def get_frequencia(self):
        return self.__frequencia

    # ----- Métodos de negócio -----

    def calcular_media(self):
        """Calcula e retorna a média aritmética das três notas."""
        return (self.__nota1 + self.__nota2 + self.__nota3) / 3

    def verificar_aprovacao(self):
        """Retorna 'Aprovado' se média >= 6.0 e frequência >= 75, senão 'Reprovado'."""
        media = self.calcular_media()
        if media >= 6.0 and self.__frequencia >= 75:
            return "Aprovado"
        return "Reprovado"

    def __str__(self):
        media = self.calcular_media()
        situacao = self.verificar_aprovacao()
        return (f"{self.__nome:<12} {self.__matricula:<12} "
                f"{self.__nota1:<6.1f} {self.__nota2:<6.1f} {self.__nota3:<6.1f} "
                f"{media:<8.2f} {self.__frequencia:<6} {situacao}")


class Turma:
    """Gerencia uma coleção de alunos e gera relatórios."""

    def __init__(self):
        self.__alunos = []

    def carregar_de_arquivo(self, caminho):
        """Lê o arquivo CSV e popula a lista de alunos."""
        with open(caminho, "r", encoding="utf-8") as arquivo:
            for linha in arquivo:
                linha = linha.strip()
                if linha:
                    partes = linha.split(";")
                    aluno = Aluno(
                        nome=partes[0],
                        matricula=partes[1],
                        nota1=float(partes[2]),
                        nota2=float(partes[3]),
                        nota3=float(partes[4]),
                        frequencia=int(partes[5])
                    )
                    self.__alunos.append(aluno)

    def obter_aprovados(self):
        """Retorna a lista de alunos aprovados."""
        aprovados = []
        for aluno in self.__alunos:
            if aluno.verificar_aprovacao() == "Aprovado":
                aprovados.append(aluno)
        return aprovados

    def obter_reprovados(self):
        """Retorna a lista de alunos reprovados."""
        reprovados = []
        for aluno in self.__alunos:
            if aluno.verificar_aprovacao() == "Reprovado":
                reprovados.append(aluno)
        return reprovados

    def gerar_relatorio(self):
        """Imprime o relatório completo de desempenho."""
        print("=" * 70)
        print("RELATÓRIO DE DESEMPENHO ACADÊMICO — VERSÃO ORIENTADA A OBJETOS")
        print("=" * 70)
        print(f"{'Nome':<12} {'Matrícula':<12} {'N1':<6} {'N2':<6} {'N3':<6} {'Média':<8} {'Freq':<6} {'Situação'}")
        print("-" * 70)

        for aluno in self.__alunos:
            print(aluno)

        aprovados = self.obter_aprovados()
        reprovados = self.obter_reprovados()

        print("-" * 70)
        print(f"Total de alunos: {len(self.__alunos)}")
        print(f"Aprovados: {len(aprovados)}")
        print(f"Reprovados: {len(reprovados)}")
        print("=" * 70)


# ----- Programa principal -----

caminho = os.path.join(os.path.dirname(os.path.abspath(__file__)), "alunos.csv")
turma = Turma()
turma.carregar_de_arquivo(caminho)
turma.gerar_relatorio()
