#include <stdio.h>

// ------ ALUNOS: 
// MYLLENA RODRIGUES OLIVEIRA (20232002800012)
// MATHEUS SILVA PAINS (20242002800320)

// ------ ATIVIDADE:
//Construir um código em C, módulos que implementem os tipos de coesão: Funcional e Sequencial.

// ------ Coesão Funcional: é quando a função só tem uma finalidade.
// A nossa função será uma função para calcular a idade de uma pessoa a partir do ano de nascimento e do ano atual.

int calcularIdade(int anoNascimento, int anoAtual) {
    return anoAtual - anoNascimento;
}

// ------ Coesão Sequencial: é quando a função tem mais de uma etapa e cada etapa depende da etapa anterior.
// A nossa função será uma função que, a partir da idade calculada da pessoa, a gente descobre quanto tempo ainda falta para ela se aposentar, considerando uma idade de aposentadoria para homens de 65 anos e para mulheres de 62 anos.

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

// ------ Main (chama as funções de coesão funcional e sequencial)
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