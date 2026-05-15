// Aluno: MATHEUS SILVA PAINS - 2024.2.0028.0032-0
// 4. Ler dois grafos (matrizes de adjacencia) e checar requisitos basicos para isomorfismo.

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

static int lerMatriz(int **m, int n) {
	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < n; ++j) {
			if (scanf("%d", &m[i][j]) != 1) {
				return 0;
			}
		}
	}

	return 1;
}

static int validarNaoDirecionado(int **m, int n) {
	for (int i = 0; i < n; ++i) {
		if (m[i][i] != 0) {
			return 0;
		}
	}

	for (int i = 0; i < n; ++i) {
		for (int j = i + 1; j < n; ++j) {
			if (m[i][j] != m[j][i]) {
				return 0;
			}
		}
	}

	return 1;
}

static int compararInteiros(const void *a, const void *b) {
	int ia = *(int*)a;
	int ib = *(int*)b;

	if (ia < ib) {
		return -1;
	}

	if (ia > ib) {
		return 1;
	}

	return 0;
}

int main(void) {
	int n1;

	if (scanf("%d", &n1) != 1) {
		return 1;
	}

	if (n1 <= 0) {
		return 1;
	}

	int **grafo1 = criarMatriz(n1);

	if (!lerMatriz(grafo1, n1)) {
		liberarMatriz(grafo1, n1);
		return 1;
	}

	int n2;

	if (scanf("%d", &n2) != 1) {
		liberarMatriz(grafo1, n1);
		return 1;
	}

	if (n2 <= 0) {
		liberarMatriz(grafo1, n1);
		return 1;
	}

	int **grafo2 = criarMatriz(n2);

	if (!lerMatriz(grafo2, n2)) {
		liberarMatriz(grafo1, n1);
		liberarMatriz(grafo2, n2);
		return 1;
	}

	if (n1 != n2) {
		printf("Nao atendem: numero de vertices diferente\n");
		liberarMatriz(grafo1, n1);
		liberarMatriz(grafo2, n2);
		return 0;
	}

	int n = n1;

	if (!validarNaoDirecionado(grafo1, n) || !validarNaoDirecionado(grafo2, n)) {
		printf("Entrada invalida\n");
		liberarMatriz(grafo1, n);
		liberarMatriz(grafo2, n);
		return 1;
	}

	int *graus1 = calloc(n, sizeof(int));
	int *graus2 = calloc(n, sizeof(int));
	int arestas1 = 0;
	int arestas2 = 0;

	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < n; ++j) {
			graus1[i] += grafo1[i][j];
			graus2[i] += grafo2[i][j];
		}
	}

	for (int i = 0; i < n; ++i) {
		for (int j = i + 1; j < n; ++j) {
			arestas1 += grafo1[i][j];
			arestas2 += grafo2[i][j];
		}
	}

	if (arestas1 != arestas2) {
		printf("Nao atendem: numero de arestas diferente\n");
		liberarMatriz(grafo1, n);
		liberarMatriz(grafo2, n);
		free(graus1);
		free(graus2);
		return 0;
	}

	qsort(graus1, n, sizeof(int), compararInteiros);
	qsort(graus2, n, sizeof(int), compararInteiros);

	for (int i = 0; i < n; ++i) {
		if (graus1[i] != graus2[i]) {
			printf("Nao atendem: sequencia de graus diferente\n");
			liberarMatriz(grafo1, n);
			liberarMatriz(grafo2, n);
			free(graus1);
			free(graus2);
			return 0;
		}
	}

	printf("Atendem aos requisitos basicos para isomorfismo\n");

	liberarMatriz(grafo1, n);
	liberarMatriz(grafo2, n);
	free(graus1);
	free(graus2);
	return 0;
}
