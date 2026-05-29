# Trabalho (Algoritmos) — Busca em Largura (BFS) e Busca em Profundidade (DFS)

Informações gerais:

- Atividade individual.
- Entregar um relatório único em PDF com os resultados e saídas dos testes.
- Envios atrasados serão penalizados.
- Prazo: 29/05/2026 23:59

## Atividade 1: Implementação da Busca em Largura em C

- Objetivo: Implementar o algoritmo de Busca em Largura em um grafo não direcionado, utilizando uma fila para controlar a ordem de visitação dos vértices.
- A Busca em Largura, ou BFS, percorre o grafo visitando primeiro os vizinhos de um vértice inicial, depois os vizinhos desses vizinhos, e assim sucessivamente.

### Enunciado

Escreva um programa em C que:

1. Leia a quantidade de vértices e arestas de um grafo;
2. Leia as arestas do grafo;
3. Leia um vértice inicial;
4. Execute a Busca em Largura a partir desse vértice;
5. Mostre a ordem em que os vértices foram visitados.

### Material de Referência (Aulas 10 e 11 - Busca_em_Profundidade_Largura.pdf)

## Atividade 2: Implementação da Busca em Profundidade em C

- Objetivo: Implementar o algoritmo de Busca em Profundidade, também conhecido como DFS — Depth-First Search, em um grafo não direcionado.
- A DFS percorre o grafo explorando um caminho o mais profundamente possível antes de voltar e tentar outro caminho.

### Enunciado

Escreva um programa em C que:

1. Leia a quantidade de vértices e arestas de um grafo;
2. Leia as arestas do grafo;
3. Leia um vértice inicial;
4. Execute a Busca em Profundidade a partir desse vértice;
5. Mostre a ordem em que os vértices foram visitados.

## Relatório

- Esse relatório tem como finalidade apresentar um script utilizando a linguagem de programação C para implementar o algoritmo de busca em largura e em profundidade, bem como apresentar os resultados obtidos.
- O script foi desenvolvido utilizando duas ferramentas, o ambiente de desenvolvimento Visual Studio Code e modelos de linguagem natural (eg. AI) como suporte para correção e direção de como implementar os dois modelos de algoritmos.
- Esse relatório também se valeu da utilização do material de referência disponilizado pelo professor da disciplina, Dr. Robson Medrado, para o direcionamento teórico da implementação dos algoritmos.

### Motivação: por que buscar em grafos?

- A utilização de grafos na ciência da computação não é uma disciplina sem importância, pois os grafos são um modelo de dados muito utilizado para representar problemas complexos e as relações dos parametros descritos. Dados essas representações, as buscas, seja por largura ou profundidade, busca transformar a exploração dessas relações em um processo organizado e sistematizado. 
- Geralmente a modelagem de grafos se vale de uma pergunta central. A de que, dado um grafo qualquer e um vértice inicial qual os caminhos possíveis para chegar em outro vértice? Seja ele um vértice final ou que exista conexão no grafo? Nesse sentido, é possível utilizar a busca para solucionar problemas como o problema do caixeiro viajante e o do menor caminho.
- O material traz também uma distinção entre Árvores e Grafos, onde os grafos são representados por arestas e vértices. Já as árvores são um tipo de grafo que não possui arestas paralelas ou ciclos. É comun a presença de ciclos e múltiplos caminhos em grafos, o que torna a a exploração desses problemas mais complexo e exigir uma abordagem diferente. Uma abordagem que define uma ordem sistematica de visita. Enquanto nas árvores as formas de exploração são diferentes, podendo ser de pré-ordem, pós-orem ou até mesmo o percurso por níveis. E, todo vértice alcançado tem um predecessor na árvore.

### Algoritmo genérico de busca no BFS e no DFS.

- O algoritmo genérico de busca serve como base para as duas implementações feitas neste trabalho, tanto para a busca em largura quanto para a busca em profundidade. A ideia principal é iniciar a busca a partir de um vértice inicial `s` e, a partir dele, ir expandindo a estrutura de visita com os vértices ainda não visitados.
- No caso do BFS, essa exploração acontece por níveis, usando uma fila para guardar os vértices que ainda precisam ser explorados. Assim, primeiro são visitados os vizinhos mais próximos e depois os demais vértices conectados a eles.
- No caso do DFS, a lógica é a mesma, no sentido de ampliar a busca a partir de um vértice inicial, porém a exploração acontece de forma mais profunda, usando uma pilha. Dessa forma, o algoritmo segue por um caminho até não conseguir avançar mais, e depois retorna para tentar outras possibilidades.
- Em ambos os casos, o critério principal é verificar se ainda existe uma aresta que liga um vértice já descoberto a outro vértice que ainda não foi visitado. Quando isso acontece, o novo vértice é adicionado na estrutura de controle da busca e passa a fazer parte da árvore de busca.
- Portanto, o algoritmo genérico é utilizado como base teórica para organizar a exploração do grafo, mudando apenas a estrutura de controle usada em cada caso, que no BFS é a fila e no DFS é a pilha.
- Um ponto de observação que o material de apoio traz, e que é possível vizualizar nos scritps, é que a escolha do vertice inicial pode influencia na ordem de busca. Como é possível ver nas imagens 'bfs.png' e 'dfs.png'.

### Busca em largura (BFS)

- A busca em largura faz a exploração do grafo por níveis, isto é, primeiro visita os vértices mais próximos do vértice inicial `s` e, depois, avança para os vértices mais distantes.
- Existe um critério de escolha, que o material de apoio traz, que é o de que dentre os vértices já alcançados, escolhe-se aquele que foi alcançado há mais tempo e que ainda possui vizinhos não visitados.
- Dessa forma, o algoritmo visita primeiro os vizinhos diretos de `s`, depois os vértices que estão a distância 2 de `s`, em seguida os vértices que estão a distância 3, e assim por diante.
- A estrutura usada nesse tipo de busca é a fila, que é regida pela máxima de "primeiro a entrar, primeiro a sair".

### Busca em Profundidade (DFS)

- A busca em profundidade faz a exploração do grafo seguindo um caminho até onde for possível para só depois retroceder e tentar outro caminho.
- Existe um críterio de escolha, que o material de apoio traz, que é de que "Dentre todos os vértices marcados e incidentes a alguma aresta ainda não explorada, escolhe-se aquele que foi mais recentemente alcançado na busca"
- A estrutura usada nesse tipo de busca é a pilha que é regida pela máxima de "Último a entrar, primeiro a sair".