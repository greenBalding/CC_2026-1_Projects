// Aluno: MATHEUS SILVA PAINS - 2024.2.0028.0032-0
// 1. Ler matriz de adjacência de grafo não direcionado e mostrar grau de cada vértice.

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

			if (m[i][j] != 0 && m[i][j] != 1) {
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

static void printarGraus(int **m, int n) {
	
    for (int i = 0; i < n; ++i) {
		
        int grau = 0;

		for (int j = 0; j < n; ++j) {
			grau += m[i][j];
		}

		printf("Vertice %d: grau %d\n", i, grau);
	}
}

int main(void){
	
    int n;

	if (scanf("%d", &n) != 1) {
		return 1;
	}

	if (n <= 0) {
		return 1;
	}

	int **mat = criarMatriz(n);

	if (!lerMatriz(mat, n)) {
		printf("Entrada invalida\n");
		liberarMatriz(mat, n);
		return 1;
	}

	if (!validarNaoDirecionado(mat, n)){
		printf("Nao e um grafo nao direcionado simples\n");
		liberarMatriz(mat, n);
		return 1;
	}

	printarGraus(mat, n);

	liberarMatriz(mat, n);

	return 0;
}
