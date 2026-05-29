// Atividade 1: Implementação da Busca em Largura em C
// Aluno: Matheus Silva Pains
// Matrícula: 2024.1.0028.0032-0

// 1. Bibliotecas 
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 2. Definição do número máximo de vértices
#define MAX_V 100

// 3. Construtores e Funções de Processamento
typedef struct No {
    int v;
    struct No *prox;
} No;

No *adj[MAX_V];

void adicionaAresta(int u, int v) {
    No *nu = malloc(sizeof(No));
    nu -> v = v;
    nu -> prox = adj[u];
    adj[u] = nu;

    No *nv = malloc(sizeof(No));
    nv -> v = u;
    nv -> prox = adj[v];
    adj[v] = nv;
}

typedef struct {
    int dados[MAX_V];
    int ini, fim, tam;
} Fila;

void inicializaFila(Fila *f) { 
    f -> ini = f -> fim = f -> tam = 0;
}

int  filaVazia(Fila *f) { 
    return f -> tam == 0;
}

void enfileira(Fila *f, int x) {
    f -> dados[f -> fim] = x;
    f -> fim = (f -> fim+1)%MAX_V;
    f -> tam++;
}

int  desenfileira(Fila *f) { 
    int x = f -> dados[f -> ini];
    f -> ini = (f -> ini+1)%MAX_V;
    f -> tam--;
    return x;
}

// R4. Função para implementar a Busca em Largura
void bfs(int s) {
    int visitado[MAX_V];
    memset(visitado, 0, sizeof(visitado));

    Fila f;
    inicializaFila(&f);

    visitado[s] = 1;
    enfileira(&f, s);

    // R5. Escreva um programa em C que mostre a ordem em que os vértices foram visitados.
    printf("Ordem de visita (BFS a partir de %d): ", s);

    while (!filaVazia(&f)) {
        int u = desenfileira(&f);
        printf("%d ", u);

        for (No *p = adj[u]; p != NULL; p = p -> prox) {
            int v = p -> v;
            if (!visitado[v]) {
                visitado[v] = 1;
                enfileira(&f, v);
            }
        }
    }
    printf("\n");
}

// 4. Main
int main(void) {
    int n, m, s;

    // R1. Escrever um programa em C que leia a quantidade de vértices e arestas do grafo.
    printf("Numero de vertices: ");
    scanf("%d", &n);

    printf("Numero de arestas: ");
    scanf("%d", &m);

    memset(adj, 0, sizeof(adj));

    // R2. Escrever um programa em C que leia as arestas do grafo.
    printf("Arestas (u v):\n");
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adicionaAresta(u, v);
    }

    // R3. Escrever um programa em C que leia o vértice inicial.
    printf("Vertice inicial: ");
    scanf("%d", &s);

    // R4. Escreva um programa em C que executa a Busca em Largura a partir do vértice inicial.
    bfs(s);
    return 0;
}