/*
 * Parte 1 - Versao Imperativa em C
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    FILE *arq;
    char linha[200];
    char nome[50], mat[20];
    float n1, n2, n3, media;
    int freq, aprovados = 0, reprovados = 0, total = 0;

    arq = fopen("alunos.csv", "r");
    if (arq == NULL) {
        printf("Erro ao abrir arquivo\n");
        return 1;
    }

    printf("Nome         Matricula    Media   Freq  Situacao\n");
    printf("------------------------------------------------\n");

    while (fgets(linha, 200, arq) != NULL) {
        linha[strcspn(linha, "\r\n")] = 0;
        if (strlen(linha) == 0) continue;

        strcpy(nome, strtok(linha, ";"));
        strcpy(mat, strtok(NULL, ";"));
        n1 = atof(strtok(NULL, ";"));
        n2 = atof(strtok(NULL, ";"));
        n3 = atof(strtok(NULL, ";"));
        freq = atoi(strtok(NULL, ";"));

        media = (n1 + n2 + n3) / 3;

        if (media >= 6.0 && freq >= 75) {
            printf("%-12s %-12s %-7.2f %-5d Aprovado\n", nome, mat, media, freq);
            aprovados++;
        } else {
            printf("%-12s %-12s %-7.2f %-5d Reprovado\n", nome, mat, media, freq);
            reprovados++;
        }
        total++;
    }

    fclose(arq);

    printf("------------------------------------------------\n");
    printf("Total: %d | Aprovados: %d | Reprovados: %d\n", total, aprovados, reprovados);

    return 0;
}
