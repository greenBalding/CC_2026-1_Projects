// Aluno: MATHEUS SILVA PAINS - 2024.2.0028.0032-0
// 2. Ler matriz de incidencia de grafo direcionado, mostrar grau de entrada/saida e converter para adjacencia.

#include <stdio.h>
#include <stdlib.h>

static int **criarMatrizLinhas(int linhas, int colunas) {
	
    int **m = malloc(linhas * sizeof(int*));

	for (int i = 0; i < linhas; ++i) {
		m[i] = malloc(colunas * sizeof(int));
	}

	return m;
}

static void liberarMatrizLinhas(int **m, int linhas) {
	
    for (int i = 0; i < linhas; ++i) {
		free(m[i]);
	}

	free(m);
}

static int lerIncidencia(int **incidencia, int n, int e) {
	
    for (int i = 0; i < n; ++i) {
		
        for (int j = 0; j < e; ++j) {
			
            if (scanf("%d", &incidencia[i][j]) != 1) {
				return 0;
			}

			if (incidencia[i][j] != -1 && incidencia[i][j] != 0 && incidencia[i][j] != 1) {
				return 0;
			}
		}
	}

	return 1;
}

int main(void) {
	int n;
	int e;

	if (scanf("%d %d", &n, &e) != 2) {
		return 1;
	}

	if (n <= 0) {
		return 1;
	}

	if (e <= 0) {
		return 1;
	}

	int **incidencia = criarMatrizLinhas(n, e);

	if (!lerIncidencia(incidencia, n, e)) {
		printf("Entrada invalida\n");
		liberarMatrizLinhas(incidencia, n);
		return 1;
	}

	int *grauEntrada = calloc(n, sizeof(int));
	int *grauSaida = calloc(n, sizeof(int));
	int **adjacencia = criarMatrizLinhas(n, n);

	// converter e calcular graus
	for (int j = 0; j < e; ++j) {
		int origem = -1;
		int destino = -1;

		for (int i = 0; i < n; ++i) {
			
			if (incidencia[i][j] == -1) {
				grauSaida[i]++;
				origem = i;
			}

			if (incidencia[i][j] == 1) {
				grauEntrada[i]++;
				destino = i;
			}
		}

		if (origem != -1 && destino != -1) {
			adjacencia[origem][destino] = 1;
		}
	}

	// imprimir graus
	for (int i = 0; i < n; ++i) {
		printf("Vertice %d: entrada %d, saida %d\n", i, grauEntrada[i], grauSaida[i]);
	}

	// imprimir matriz de adjacencia
	printf("Matriz de adjacencia:\n");

	for (int i = 0; i < n; ++i) {
		
        for (int j = 0; j < n; ++j) {
			printf("%d ", adjacencia[i][j]);
		}

		printf("\n");
	}

	liberarMatrizLinhas(incidencia, n);
	liberarMatrizLinhas(adjacencia, n);

	free(grauEntrada);
	free(grauSaida);

	return 0;
}
