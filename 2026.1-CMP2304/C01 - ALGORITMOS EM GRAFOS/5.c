// Aluno: MATHEUS SILVA PAINS - 2024.2.0028.0032-0
// 5. Ler matriz de adjacencia e verificar se e ciclo, completo ou roda.

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
	int arestas = 0;

	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < n; ++j) {
			graus[i] += adjacencia[i][j];
		}
	}

	for (int i = 0; i < n; ++i) {
		for (int j = i + 1; j < n; ++j) {
			arestas += adjacencia[i][j];
		}
	}

	int ehCompleto = 0;

	if (arestas == n * (n - 1) / 2) {
		ehCompleto = 1;
	}

	int todosGrausDois = 1;

	for (int i = 0; i < n; ++i) {
		if (graus[i] != 2) {
			todosGrausDois = 0;
			break;
		}
	}

	int ehCiclo = 0;

	if (todosGrausDois && ehConexo(n, adjacencia, graus) && arestas == n) {
		ehCiclo = 1;
	}

	int ehRoda = 0;

	if (n >= 4) {
		int quantidadeCentros = 0;

		for (int i = 0; i < n; ++i) {
			if (graus[i] == n - 1) {
				quantidadeCentros++;
			}
		}

		int outrosOk = 1;

		for (int i = 0; i < n; ++i) {
			if (graus[i] != n - 1 && graus[i] != 3) {
				outrosOk = 0;
				break;
			}
		}

		if (quantidadeCentros == 1 && outrosOk && ehConexo(n, adjacencia, graus) && arestas == 2 * (n - 1)) {
			ehRoda = 1;
		}
	}

	if (ehCiclo) {
		printf("Ciclo\n");
	} else if (ehCompleto) {
		printf("Completo\n");
	} else if (ehRoda) {
		printf("Roda\n");
	} else {
		printf("Nenhum\n");
	}

	free(graus);
	liberarMatriz(adjacencia, n);
	return 0;
}
