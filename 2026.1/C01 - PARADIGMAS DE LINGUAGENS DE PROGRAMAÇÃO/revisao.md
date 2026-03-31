# Revisão
---
Data: 31/03/2026
---

## Nomeação

### Ligação (binding)

**O que é?**

É a associação entre um identificador e um atributo de código.

Esse atributo pode ser, por exemplo:
- um valor
- um tipo
- uma variável
- uma função
- um endereço de memória

Em resumo, quando escrevemos um identificador (nome), a linguagem e o ambiente de execução precisam "ligar" esse nome ao que ele representa.

**Motivação do uso**

A ligação é usada para:
- dar significado aos nomes no código
- permitir reutilização e organização (não precisamos trabalhar só com valores literais)
- viabilizar verificação de tipos e detecção de erros
- permitir abstração (nomes para funções, módulos, classes, etc.)
- facilitar manutenção e leitura do software

Sem ligação, o código ficaria muito mais difícil de escrever, entender e executar.

### Nomeação: papel dos identificadores

#### Ideia central

Para o compilador, nomes são identificadores formais (sequências de caracteres que seguem regras da linguagem).
Ele não interpreta intenção humana do nome; ele usa tokens e tabela de símbolos.

#### Motivação da nomeação

- Para humanos: melhorar legibilidade, manutenção e organização.
- Para o compilador: permitir referência consistente aos elementos do programa.

Importante: nomes "significativos" ajudam pessoas, não mudam o funcionamento semântico do compilador.

### Ligação entre código, tradução e variáveis

O funcionamento coerente do programa depende da ligação entre:
- o que foi escrito (código fonte)
- como o sistema processa (compilação/interpretação e análise semântica)
- como os dados existem em execução (variáveis, valores e memória)

Termo técnico preferível: use compilação/interpretação em vez de "digestão do código".

### Classificação geral de binding

- Ligação estática: resolvida antes da execução (tipicamente em compilação).
- Ligação dinâmica: resolvida durante a execução.

Exemplo:
int idade = 25;

- idade -> identificador
- int -> tipo
- 25 -> valor

As ligações podem ocorrer em momentos diferentes do ciclo do programa.

### Ligação de nomes, tipos, valores e momentos de execução (binding time)

#### Ideia central

Um identificador (por exemplo, uma variável) se relaciona com diferentes atributos ao longo da vida do programa:
- nome -> tipo
- nome -> valor
- nome -> endereço de memória

Por isso, saber apenas o tipo não é suficiente. Também é necessário saber o valor e onde esse dado está armazenado.

#### Exemplo simples em C

int idade = 20;

Nesse caso, ocorrem ligações de:
- idade -> tipo int
- idade -> valor 20
- idade -> endereço de memória

#### Tipos de ligação mais cobrados

- Ligação de tipo: define que espécie de dado o identificador representa.
- Ligação de valor: associa um conteúdo ao identificador.
- Ligação de armazenamento: associa o identificador a uma posição de memória.

#### Binding time (quando a ligação acontece)

A pergunta principal é: em que momento cada ligação é feita?

Momentos clássicos:
- Tempo de compilação: várias decisões de tipo são definidas aqui.
- Tempo de carregamento: algumas ligações são ajustadas quando o programa é carregado na memória.
- Tempo de execução (runtime): valores mudam e alocações efetivas ocorrem durante a execução.

#### Fases úteis para pensar o tema

1. Código fonte: o que o programador escreve.
2. Tradução (compilação/interpretação): o sistema analisa e transforma o código.
3. Execução: o programa roda e manipula valores e memória.

#### Resumo para prova

Programar envolve criar nomes que, ao longo do tempo, são ligados a:
- o que é (tipo)
- quanto vale (valor)
- onde está (endereço)

O conceito de binding time estuda exatamente quando cada uma dessas ligações ocorre.

## Declaração vs Definição

### O que é declaração?

Declaração apresenta um nome ao compilador e informa suas características (como tipo e assinatura), sem necessariamente criar armazenamento naquele ponto.

Exemplos em C:
- int soma(int a, int b);  -> declaração de função (protótipo)
- extern int contador;     -> declaração de variável definida em outro arquivo

### Declaração (foco de prova)

Tema recorrente em avaliações: costuma ser muito cobrado.
Também é considerado difícil por causar confusão conceitual.

Definição essencial:
- Declaração informa ao compilador o identificador e o tipo.

Exemplo:
- int x;

No exemplo:
- x -> nome
- int -> tipo
- não há inicialização explícita de valor

Diferença chave:
- Declaração: int x;
- Inicialização: int x = 10;

#### Por que esse tema é difícil?

Principal fonte de erro em prova:
- confundir declaração, inicialização e definição

Exemplo em C:
- int x;      -> declaração (e, em C, também definição com armazenamento)
- int x = 10; -> declaração + inicialização (também definição)

Resumo prático:
- Declaração: apresenta nome/tipo.
- Inicialização: atribui valor inicial.
- Definição: cria a entidade de fato no programa.

### O que é definição?

Definição cria de fato a entidade no programa.
No caso de variável, normalmente reserva armazenamento. No caso de função, fornece o corpo da função.

Exemplos em C:
- int contador = 0;        -> definição de variável global
- int soma(int a, int b) { return a + b; }  -> definição de função

### Regra prática para prova

- Declaração: "diz que existe".
- Definição: "cria/implementa".

Observação importante em C:
Toda definição também é uma declaração, mas nem toda declaração é uma definição.

### Exemplo comparando no mesmo contexto

Arquivo A (uso):
- extern int total;        -> só declara

Arquivo B (origem):
- int total = 10;          -> define

Sem a definição real em algum ponto do programa, o linker reclamará de símbolo não resolvido.

## Cabeçalhos (.h): declaração vs definição

### Ideia central

Em C/C++, arquivos de cabeçalho (.h) normalmente contêm declarações.
Eles descrevem a interface (tipos, protótipos e contratos), sem criar instâncias em memória.

Resumo:
- Declaração: informa que algo existe.
- Definição: mostra como e cria de fato a entidade no programa.

### O que costuma ir no .h

- Protótipos de função
- Declarações de tipos (struct, typedef, enum)
- Declarações externas (ex: extern)
- Constantes e macros de interface

### O que costuma ir no .c

- Definições de função (corpo)
- Definições de variáveis globais
- Implementação interna do modulo

### Por que isso existe (compilação separada)

Separar .h e .c permite compilação separada (separate compilation):
- cada modulo pode ser compilado independentemente
- melhora organizacao e manutencao
- reduz recompilacao desnecessaria

### Exemplo classico

soma.h
int soma(int a, int b);  // declaracao

soma.c
int soma(int a, int b) { // definicao
	return a + b;
}

Frase curta para prova:
- A declaracao diz "isso existe".
- A definicao diz "isso e assim".

## Compilacao separada e multiplos arquivos .c

### Ideia central

Em C, um projeto pode ter varios arquivos .c.
Cada arquivo .c e compilado separadamente e gera um arquivo objeto (.o), nao um executavel final.

### Problema tipico

Se main.c chama uma funcao implementada em soma.c, o compilador de main.c precisa conhecer a declaracao dessa funcao.

Exemplo:
// main.c
int main() {
	 int r = soma(2, 3);
}

Sem declaracao de soma, ocorre erro de compilacao (ou, no minimo, diagnostico de uso sem prototipo, dependendo do padrao/flags).

### Solucao

Declarar no cabecalho e incluir no arquivo que usa:

// soma.h
int soma(int a, int b);

// main.c
#include "soma.h"

Assim, o compilador conhece:
- nome da funcao
- tipos dos parametros
- tipo de retorno

### Fluxo correto (prova)

1. Compilacao separada:
	- gcc -c soma.c   -> soma.o
	- gcc -c main.c   -> main.o
2. Ligacao (link):
	- gcc main.o soma.o -> executavel

### Resumo curto

- .h diz o que existe (interface)
- .c diz como funciona (implementacao)
- linker junta os objetos e resolve referencias

## C vs outras linguagens: separacao e bytecode

### Declaracao e definicao em linguagens diferentes

Em algumas linguagens, nao ha separacao explicita entre declaracao e definicao no estilo .h/.c.
Muitas vezes tudo aparece no mesmo arquivo ou bloco de codigo.

Exemplos comuns:
- Python
- JavaScript

Em C, a separacao e mais explicita:
- declaracoes em .h
- definicoes em .c

### Sobre "parcode": termo correto

O termo correto, nesse contexto, e bytecode.

Bytecode = codigo intermediario portatil, executado por uma VM ou interpretador.

Exemplos:
- Java -> bytecode na JVM
- Python -> bytecode executado pelo interpretador

Vantagem principal:
- maior portabilidade entre plataformas

### Diferenca central para C

- C: compilacao para codigo de maquina especifico da arquitetura alvo.
- Linguagens com bytecode: geram representacao intermediaria antes da execucao final.

### Resumo de prova

Contraste classico:
- C -> separacao declaracao/definicao + compilacao nativa.
- Outras linguagens -> menor enfase nessa separacao + uso de bytecode/intermediario.

## Escopo vs Tempo de vida (lifetime)

### Distincao essencial

- Escopo: onde o nome pode ser usado no codigo.
- Tempo de vida: por quanto tempo a variavel existe na memoria.

Resumo de prova:
- Escopo responde "onde posso acessar?"
- Tempo de vida responde "quando existe?"

### Exemplo em C

int x = 10; // escopo global, vida durante todo o programa

void f() {
	int y = 5; // escopo local, vida durante a execucao de f
}

Leitura do exemplo:
- x: escopo global; lifetime do programa inteiro.
- y: escopo local de f; lifetime limitado a chamada de f.

### Observacao importante

Escopo e lifetime nao sao a mesma coisa.
Uma variavel pode existir na memoria e ainda assim nao estar acessivel em certo ponto do codigo.

## Criação de struct dentro de função (stack vs heap)

### Pergunta comum

É possível criar um nó (struct) dentro de uma função?
Sim. É possível declarar uma variável do tipo struct dentro da função.

Exemplo:
void f() {
	struct no n;
}

### Interpretação correta

- A variável local é criada durante a execução da função.
- Em geral, essa variável fica na stack (alocação automática).
- Ela só existe dentro do escopo da função.
- Ao final da função, essa variável local deixa de existir.

### Exemplo com uso local

void f() {
	struct no n;
	n.valor = 10;
	n.proximo = NULL;
}

### Quando o nó precisa sobreviver após a função

Use alocação dinâmica:

struct no* criarNo() {
	struct no* n = malloc(sizeof(struct no));
	return n;
}

Diferença central:
- Dentro da função (variável local): stack, temporário.
- Com malloc: heap, persiste até free.

## Alocação de memória, offsets e atribuição de valores

### 1. O que é offset

Offset é o deslocamento relativo em memória entre dados dentro de uma mesma estrutura de organização.

Exemplo com inteiros de 4 bytes:
- a em offset 0
- b em offset 4
- c em offset 8

Isso explica a sequência 0 -> 4 -> 8 quando os tipos têm o mesmo tamanho e não há padding entre eles.

### 2. Organização da memória do processo

De forma clássica, um processo possui regiões como:
- Segmento de dados: globais e estáticas.
- Pilha (stack): variáveis locais e chamadas de função.
- Heap: alocação dinâmica.

Observação: dizer apenas "área de dados" pode ser genérico demais. Em prova, diferencie stack, data segment e heap.

### 3. Quem define offsets e quem define endereços reais

Resumo correto:
- Compilador: organiza layout e offsets (posição relativa).
- Sistema operacional + loader: mapeiam o processo e atribuem endereços virtuais reais no carregamento/execução.

Fluxo simplificado:
1. Código é compilado.
2. Programa é carregado.
3. O processo é criado.
4. Memória virtual é mapeada para execução.

### 4. Momento da ligação de valor

A declaração pode existir sem valor útil inicial.
O valor é ligado quando ocorre atribuição.

Exemplo:
int x;
x = 10;

No exemplo acima, a ligação nome -> valor acontece na atribuição.

### 5. Cuidado com alinhamento e padding

A sequência de endereços nem sempre é "perfeita" byte a byte.
Por alinhamento, o compilador pode inserir padding.

Exemplo comum:
- char a;  (1 byte)
- int b;   (4 bytes)

Possível layout:
- a em offset 0
- 3 bytes de padding
- b em offset 4

Isso normalmente melhora desempenho de acesso da CPU.

### Resumo para prova

Uma variável tem pelo menos três aspectos:
- posição relativa (offset)
- posição real no processo (endereço)
- conteúdo atual (valor)

Esses aspectos podem ser definidos em momentos diferentes (compilação, carregamento e execução).

### Observação de aula (exemplo: int x = 10;)

Regra prática que apareceu em sala:
- valor -> execução (inicialização)
- tipo -> compilação
- endereço -> compilação

Como interpretar corretamente para prova:
- Tipo em compilação está correto no caso usual de C estático.
- Valor pode ser visto na inicialização/execução (especialmente em variáveis locais).
- Endereço costuma ser tratado em aula como "definido na compilação" no sentido de layout/offset; tecnicamente, o endereço virtual efetivo é consolidado no carregamento/execução do processo.

Em questões teóricas, responda com a visão do professor e, se couber justificativa, cite a nuance: compilador define layout; SO/loader mapeiam endereço efetivo.
