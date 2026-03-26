#include <stdio.h>

// ------ ALUNOS: 
// MYLLENA RODRIGUES OLIVEIRA
// MATHEUS SILVA PAINS

// ==========================================================
// COESÃO FUNCIONAL
// ==========================================================

// Função com coesão funcional: realiza apenas o cálculo da idade
int calcularIdade(int anoNascimento, int anoAtual) {
    return anoAtual - anoNascimento;
}

// ==========================================================
// COESÃO SEQUENCIAL
// ==========================================================

// Função que representa um fluxo sequencial completo
void processoAposentadoria() {
    int anoNascimento, anoAtual, idade, tempo;
    char sexo;

    printf("Digite o ano de nascimento: ");
    scanf("%d", &anoNascimento);

    printf("Digite o ano atual: ");
    scanf("%d", &anoAtual);

    printf("Digite o sexo (M/F): ");
    scanf(" %c", &sexo);

    // Etapa 1: cálculo da idade (lógica reaplicada)
    idade = anoAtual - anoNascimento;

    // Etapa 2: cálculo da aposentadoria
    if (sexo == 'M' || sexo == 'm') {
        tempo = 65 - idade;
    } else {
        tempo = 62 - idade;
    }

    // Etapa 3: saída
    printf("\nIdade: %d anos\n", idade);

    if (tempo > 0) {
        printf("Faltam %d anos para aposentadoria.\n", tempo);
    } else {
        printf("Voce ja pode se aposentar!\n");
    }
}

// ==========================================================
// MAIN COM MENU
// ==========================================================

int main() {
    int opcao;

    do {
        printf("\n===== MENU =====\n");
        printf("1 - Coesao Funcional\n");
        printf("2 - Coesao Sequencial\n");
        printf("0 - Sair\n");
        printf("Escolha: ");
        scanf("%d", &opcao);

        switch(opcao) {

            case 1: {
                int anoNascimento, anoAtual;

                printf("Digite o ano de nascimento: ");
                scanf("%d", &anoNascimento);

                printf("Digite o ano atual: ");
                scanf("%d", &anoAtual);

                int idade = calcularIdade(anoNascimento, anoAtual);

                printf("Idade calculada: %d anos\n", idade);
                break;
            }

            case 2: {
                // Aqui NÃO chamamos a função funcional
                // Todo o fluxo é independente (coesão sequencial)
                processoAposentadoria();
                break;
            }
        }

    } while(opcao != 0);

    return 0;
}