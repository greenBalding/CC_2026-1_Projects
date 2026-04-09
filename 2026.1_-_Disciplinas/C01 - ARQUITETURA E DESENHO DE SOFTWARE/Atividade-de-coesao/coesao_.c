#include <stdio.h>
#include <stdlib.h>

// ------ ALUNOS: 
// MYLLENA RODRIGUES OLIVEIRA
// MATHEUS SILVA PAINS

// ==========================================================
// COESÃO COMUNICACIONAL
// ==========================================================

// Usa os mesmos dados (idade e sexo)
void coesaoComunicacional() {
    int idade = 30;
    char sexo = 'F';

    printf("\nIdade: %d\n", idade);

    if (sexo == 'M')
        printf("Sexo: Masculino\n");
    else
        printf("Sexo: Feminino\n");
}

// ==========================================================
// COESÃO PROCEDURAL
// ==========================================================

void coesaoProcedural() {
    int num;

    printf("\nDigite um numero: ");
    scanf("%d", &num);

    num = num * 2;
    printf("Dobro: %d\n", num);

    printf("Processo finalizado.\n");
}

// ==========================================================
// COESÃO TEMPORAL
// ==========================================================

void coesaoTemporal() {
    printf("\nInicializando sistema...\n");
    printf("Carregando dados...\n");
    printf("Sistema pronto!\n");
}

// ==========================================================
// COESÃO LÓGICA
// ==========================================================

void coesaoLogica() {
    int opcao;

    printf("\n1 - Mostrar idade\n");
    printf("2 - Mostrar mensagem\n");
    scanf("%d", &opcao);

    if (opcao == 1)
        printf("Idade: 25\n");
    else
        printf("Bem-vindo ao sistema!\n");
}

// ==========================================================
// COESÃO COINCIDENTAL
// ==========================================================

void coesaoCoincidental() {
    printf("\nMensagem qualquer\n");

    int x = rand() % 100;
    printf("Numero aleatorio: %d\n", x);

    printf("Fim do modulo\n");
}

// ==========================================================
// MAIN
// ==========================================================

int main() {
    int opcao;

    do {
        printf("\n===== MENU =====\n");
        printf("1 - Comunicacional\n");
        printf("2 - Procedural\n");
        printf("3 - Temporal\n");
        printf("4 - Logica\n");
        printf("5 - Coincidental\n");
        printf("0 - Sair\n");
        scanf("%d", &opcao);

        switch(opcao) {
            case 1: coesaoComunicacional(); break;
            case 2: coesaoProcedural(); break;
            case 3: coesaoTemporal(); break;
            case 4: coesaoLogica(); break;
            case 5: coesaoCoincidental(); break;
        }

    } while(opcao != 0);

    return 0;
}