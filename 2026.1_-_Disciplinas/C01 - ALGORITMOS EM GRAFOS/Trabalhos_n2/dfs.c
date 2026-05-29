// Atividade 2: Implementação da Busca em Profundidade em C
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
    int topo;
} Pilha;

void inicializaPilha(Pilha *p) { 
    p -> topo = -1; 
}

int  pilhaVazia(Pilha *p) { 
    return p -> topo < 0;
}

void empilha(Pilha *p, int x) { 
    p -> dados[++(p -> topo)] = x;
}

int  consulta(Pilha *p) {
    return p -> dados[p -> topo];
}

int  desempilha(Pilha *p) {
    return p -> dados[(p -> topo)--];
}

// R4. Função para implementar a Busca em Profundidade
void dfs(int s) {
    int visitado[MAX_V];
    memset(visitado, 0, sizeof(visitado));

    Pilha p;
    inicializaPilha(&p);

    visitado[s] = 1;
    empilha(&p, s);

    // R5. Escreva um programa em C que mostre a ordem em que os vértices foram visitados.
        printf("Ordem de visita (DFS a partir de %d): ", s);
        printf("%d ", s);

    while (!pilhaVazia(&p)) {
        int u = consulta(&p);
        int achou = 0;

        for (No *viz = adj[u]; viz != NULL; viz = viz -> prox) {
            if (!visitado[viz -> v]) {
                visitado[viz -> v] = 1;
                empilha(&p, viz -> v);
                    printf("%d ", viz -> v);
                achou = 1;
                break;
            }
        }

        if (!achou)
            desempilha(&p);
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

    // R4. Escreva um programa em C que executa a Busca em Profundidade a partir do vértice inicial.
    dfs(s);
    return 0;
}