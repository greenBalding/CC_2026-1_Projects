/* =============================================================
 * Parte 1 — Implementacao Imperativa
 * Sistema de Analise de Desempenho Academico
 * Paradigma: Imperativo/Procedural (C)
 * ============================================================= */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ALUNOS 50
#define MAX_NOME 50

/* ----- Estrutura de dados ----- */

typedef struct {
    char nome[MAX_NOME];
    char matricula[20];
    float nota1;
    float nota2;
    float nota3;
    int frequencia;
} Aluno;

/* ----- Funcoes procedurais ----- */

float calcular_media(float n1, float n2, float n3) {
    float media;
    media = (n1 + n2 + n3) / 3.0;
    return media;
}

int verificar_aprovacao(float media, int frequencia) {
    if (media >= 6.0 && frequencia >= 75) {
        return 1; /* aprovado */
    } else {
        return 0; /* reprovado */
    }
}

int ler_arquivo(const char *caminho, Aluno alunos[]) {
    FILE *arquivo;
    char linha[256];
    int total = 0;

    arquivo = fopen(caminho, "r");
    if (arquivo == NULL) {
        printf("Erro ao abrir o arquivo: %s\n", caminho);
        return 0;
    }

    while (fgets(linha, sizeof(linha), arquivo) != NULL) {
        if (strlen(linha) <= 1) {
            continue;
        }
        /* Remove o \n final */
        linha[strcspn(linha, "\r\n")] = '\0';

        /* Parsing manual com sscanf e strtok */
        char *token;
        token = strtok(linha, ";");
        if (token != NULL) strcpy(alunos[total].nome, token);

        token = strtok(NULL, ";");
        if (token != NULL) strcpy(alunos[total].matricula, token);

        token = strtok(NULL, ";");
        if (token != NULL) alunos[total].nota1 = atof(token);

        token = strtok(NULL, ";");
        if (token != NULL) alunos[total].nota2 = atof(token);

        token = strtok(NULL, ";");
        if (token != NULL) alunos[total].nota3 = atof(token);

        token = strtok(NULL, ";");
        if (token != NULL) alunos[total].frequencia = atoi(token);

        total = total + 1;

        if (total >= MAX_ALUNOS) {
            break;
        }
    }

    fclose(arquivo);
    return total;
}

void gerar_relatorio(Aluno alunos[], int total) {
    int i;
    int total_aprovados = 0;
    int total_reprovados = 0;
    float media;
    int aprovado;

    printf("======================================================================\n");
    printf("RELATORIO DE DESEMPENHO ACADEMICO - VERSAO IMPERATIVA (C)\n");
    printf("======================================================================\n");
    printf("%-12s %-12s %-6s %-6s %-6s %-8s %-6s %s\n",
           "Nome", "Matricula", "N1", "N2", "N3", "Media", "Freq", "Situacao");
    printf("----------------------------------------------------------------------\n");

    i = 0;
    while (i < total) {
        media = calcular_media(alunos[i].nota1, alunos[i].nota2, alunos[i].nota3);
        aprovado = verificar_aprovacao(media, alunos[i].frequencia);

        if (aprovado == 1) {
            total_aprovados = total_aprovados + 1;
        } else {
            total_reprovados = total_reprovados + 1;
        }

        printf("%-12s %-12s %-6.1f %-6.1f %-6.1f %-8.2f %-6d %s\n",
               alunos[i].nome,
               alunos[i].matricula,
               alunos[i].nota1,
               alunos[i].nota2,
               alunos[i].nota3,
               media,
               alunos[i].frequencia,
               aprovado ? "Aprovado" : "Reprovado");

        i = i + 1;
    }

    printf("----------------------------------------------------------------------\n");
    printf("Total de alunos: %d\n", total);
    printf("Aprovados: %d\n", total_aprovados);
    printf("Reprovados: %d\n", total_reprovados);
    printf("======================================================================\n");
}

/* ----- Programa principal ----- */

int main(void) {
    Aluno alunos[MAX_ALUNOS];
    int total;

    total = ler_arquivo("alunos.csv", alunos);

    if (total > 0) {
        gerar_relatorio(alunos, total);
    }

    return 0;
}
