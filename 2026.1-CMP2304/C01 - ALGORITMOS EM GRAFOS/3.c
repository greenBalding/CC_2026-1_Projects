// Aluno: MATHEUS SILVA PAINS - 2024.2.0028.0032-0
// 3. Ler lista de adjacência, imprimir a lista recebida e a matriz correspondente.

#include <stdio.h>
#include <stdlib.h>

static int **criarMatriz(int n) {
	int **m = malloc(n * sizeof(int*));

	for (int i = 0; i < n; ++i) {
		m[i] = calloc(n, sizeof(int));
	}

	return m;
}

static void liberarMatriz(int **m, int n) {
	for (int i = 0; i < n; ++i) {
		free(m[i]);
	}

	free(m);
}

static int lerListaAdjacencia(int **adjacencia, int n) {
	for (int vertice = 0; vertice < n; ++vertice) {
		int quantidadeVizinhos;

		if (scanf("%d", &quantidadeVizinhos) != 1) {
			return 0;
		}

		if (quantidadeVizinhos < 0) {
			return 0;
		}

		for (int indice = 0; indice < quantidadeVizinhos; ++indice) {
			int vizinho;

			if (scanf("%d", &vizinho) != 1) {
				return 0;
			}

			if (vizinho < 0 || vizinho >= n) {
				return 0;
			}

			adjacencia[vertice][vizinho] = 1;
		}
	}

	return 1;
}

static void printarLista(int **adjacencia, int n) {
	for (int vertice = 0; vertice < n; ++vertice) {
		printf("%d:", vertice);

		for (int vizinho = 0; vizinho < n; ++vizinho) {
			if (adjacencia[vertice][vizinho]) {
				printf(" %d", vizinho);
			}
		}

		printf("\n");
	}
}

static void printarMatriz(int **adjacencia, int n) {
	printf("Matriz de adjacencia:\n");

	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < n; ++j) {
			printf("%d ", adjacencia[i][j]);
		}

		printf("\n");
	}
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

	if (!lerListaAdjacencia(adjacencia, n)) {
		printf("Entrada invalida\n");
		liberarMatriz(adjacencia, n);
		return 1;
	}

	printarLista(adjacencia, n);
	printarMatriz(adjacencia, n);

	liberarMatriz(adjacencia, n);
	return 0;
}
