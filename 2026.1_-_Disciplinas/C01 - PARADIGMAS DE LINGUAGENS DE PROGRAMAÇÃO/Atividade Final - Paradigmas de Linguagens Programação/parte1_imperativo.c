/*
 * Parte 1 - Implementacao Imperativa (C)
 * Sistema de Analise de Desempenho Academico
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    FILE *arquivo;
    char linha[200];
    char nome[50];
    char matricula[20];
    float nota1, nota2, nota3;
    int frequencia;
    float media;
    int total = 0;
    int aprovados = 0;
    int reprovados = 0;

    arquivo = fopen("alunos.csv", "r");
    if (arquivo == NULL) {
        printf("Erro ao abrir o arquivo!\n");
        return 1;
    }

    printf("======================================================================\n");
    printf("RELATORIO DE DESEMPENHO ACADEMICO - VERSAO IMPERATIVA (C)\n");
    printf("======================================================================\n");
    printf("%-12s %-12s %-6s %-6s %-6s %-8s %-6s %s\n",
           "Nome", "Matricula", "N1", "N2", "N3", "Media", "Freq", "Situacao");
    printf("----------------------------------------------------------------------\n");

    while (fgets(linha, 200, arquivo) != NULL) {
        linha[strcspn(linha, "\r\n")] = '\0';

        if (strlen(linha) == 0)
            continue;

        /* separa os campos */
        char *campo = strtok(linha, ";");
        strcpy(nome, campo);

        campo = strtok(NULL, ";");
        strcpy(matricula, campo);

        campo = strtok(NULL, ";");
        nota1 = atof(campo);

        campo = strtok(NULL, ";");
        nota2 = atof(campo);

        campo = strtok(NULL, ";");
        nota3 = atof(campo);

        campo = strtok(NULL, ";");
        frequencia = atoi(campo);

        /* calcula a media */
        media = (nota1 + nota2 + nota3) / 3.0;

        /* verifica aprovacao */
        if (media >= 6.0 && frequencia >= 75) {
            printf("%-12s %-12s %-6.1f %-6.1f %-6.1f %-8.2f %-6d Aprovado\n",
                   nome, matricula, nota1, nota2, nota3, media, frequencia);
            aprovados++;
        } else {
            printf("%-12s %-12s %-6.1f %-6.1f %-6.1f %-8.2f %-6d Reprovado\n",
                   nome, matricula, nota1, nota2, nota3, media, frequencia);
            reprovados++;
        }

        total++;
    }

    fclose(arquivo);

    printf("----------------------------------------------------------------------\n");
    printf("Total de alunos: %d\n", total);
    printf("Aprovados: %d\n", aprovados);
    printf("Reprovados: %d\n", reprovados);
    printf("======================================================================\n");

    return 0;
}
