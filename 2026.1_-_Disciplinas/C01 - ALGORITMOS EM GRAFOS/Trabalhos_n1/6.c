// Aluno: MATHEUS SILVA PAINS - 2024.2.0028.0032-0
// 6. Ler matriz de adjacencia e verificar se possui ciclo euleriano (grafo nao direcionado).

#include <stdio.h>
#include <stdlib.h>

static int **criarMatriz(int n) {
	int **m = malloc(n * sizeof(int*));

	for (int i = 0; i < n; ++i) {
		m[i] = malloc(n * sizeof(int));
	}

	return m;
}

static void liberarMatriz(int **m, int n) {
	for (int i = 0; i < n; ++i) {
		free(m[i]);
	}

	free(m);
}

static int ehConexo(int n, int **adjacencia, int *graus) {
	int inicio = -1;

	for (int i = 0; i < n; ++i) {
		if (graus[i] > 0) {
			inicio = i;
			break;
		}
	}

	if (inicio == -1) {
		return 1;
	}

	int *visitado = calloc(n, sizeof(int));
	int *fila = malloc(n * sizeof(int));
	int inicioFila = 0;
	int fimFila = 0;

	fila[fimFila++] = inicio;
	visitado[inicio] = 1;

	while (inicioFila < fimFila) {
		int atual = fila[inicioFila++];

		for (int vizinho = 0; vizinho < n; ++vizinho) {
			if (adjacencia[atual][vizinho] && !visitado[vizinho]) {
				visitado[vizinho] = 1;
				fila[fimFila++] = vizinho;
			}
		}
	}

	for (int i = 0; i < n; ++i) {
		if (graus[i] > 0 && !visitado[i]) {
			free(visitado);
			free(fila);
			return 0;
		}
	}

	free(visitado);
	free(fila);
	return 1;
}

int main(void) {
	int n;

	if (scanf("%d", &n) != 1) {
		return 1;
	}

	if (n <= 0) {
		return 1;
	}

	int **adjacencia = criarMatriz(n);

	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < n; ++j) {
			if (scanf("%d", &adjacencia[i][j]) != 1) {
				liberarMatriz(adjacencia, n);
				return 1;
			}
		}
	}

	for (int i = 0; i < n; ++i) {
		if (adjacencia[i][i] != 0) {
			printf("Entrada invalida\n");
			liberarMatriz(adjacencia, n);
			return 1;
		}
	}

	for (int i = 0; i < n; ++i) {
		for (int j = i + 1; j < n; ++j) {
			if (adjacencia[i][j] != adjacencia[j][i]) {
				printf("Entrada invalida\n");
				liberarMatriz(adjacencia, n);
				return 1;
			}
		}
	}

	int *graus = calloc(n, sizeof(int));

	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < n; ++j) {
			graus[i] += adjacencia[i][j];
		}
	}

	if (!ehConexo(n, adjacencia, graus)) {
		printf("Nao possui ciclo euleriano\n");
		free(graus);
		liberarMatriz(adjacencia, n);
		return 0;
	}

	for (int i = 0; i < n; ++i) {
		if (graus[i] % 2 != 0) {
			printf("Nao possui ciclo euleriano\n");
			free(graus);
			liberarMatriz(adjacencia, n);
			return 0;
		}
	}

	printf("Possui ciclo euleriano\n");

	free(graus);
	liberarMatriz(adjacencia, n);
	return 0;
}
