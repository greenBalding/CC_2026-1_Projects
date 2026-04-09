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

Em resumo, quando escrevemos um identificador (nome), a linguagem e o ambiente de execução precisam ligar esse nome ao que ele representa.

**Motivação do uso**

A ligação é usada para:
- dar significado técnico aos nomes no código
- permitir organização e reutilização
- viabilizar verificação de tipos e detecção de erros
- permitir abstração (funções, módulos, tipos)
- facilitar manutenção e leitura

Sem ligação, o código ficaria muito mais difícil de escrever, entender e executar.

### Nomeação e compilador

Para o compilador, nomes são identificadores formais (sequências de caracteres válidas).
Ele não interpreta intenção humana do nome; usa tokens e tabela de símbolos.

Importante:
- nomes significativos ajudam humanos
- para o compilador, o essencial é consistência sintática e semântica

### Classificação de binding

- Ligação estática: resolvida antes da execução (tipicamente em compilação).
- Ligação dinâmica: resolvida durante a execução.

Exemplo:

```c
int idade = 25;
```

- idade -> identificador
- int -> tipo
- 25 -> valor

### Binding time (quando a ligação acontece)

A pergunta central é: em que momento cada ligação é feita?

Momentos clássicos:
- compilação
- carregamento
- execução (runtime)

### Ligação de nomes, tipos, valores e momentos de execução (binding time)

#### Resumo de prova

Um identificador (por exemplo, uma variável) se relaciona com diferentes atributos ao longo da vida do programa:
- nome -> tipo
- nome -> valor
- nome -> endereço de memória

Por isso, saber apenas o tipo não é suficiente. Também é necessário saber o valor e onde esse dado está armazenado.

#### Exemplo simples em C

```c
int idade = 20;
```

Nesse caso, ocorrem ligações de:
- idade -> tipo int
- idade -> valor 20
- idade -> endereço de memória

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

### O que é definição?

Definição cria de fato a entidade no programa.
No caso de variável, normalmente reserva armazenamento. No caso de função, fornece o corpo da função.

Exemplos em C:
- int contador = 0;        -> definição de variável global
- int soma(int a, int b) { return a + b; }  -> definição de função

### Regras de prova (e ponto que mais confunde)

- Declaração: "diz que existe".
- Definição: "cria/implementa".
- Inicialização: atribui valor inicial.

Observação importante em C:
Toda definição também é uma declaração, mas nem toda declaração é uma definição.

Regra contextual útil:
- `extern int x;` -> declara, não define armazenamento.
- `int x;` (arquivo/escopo adequado) -> declara e normalmente define armazenamento.
- `int x = 10;` -> declaração + definição + inicialização.

Exemplo:

```c
int x;      // declaração (e, em C, normalmente definição)
int x = 10; // declaração + definição + inicialização
```

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
- Implementação interna do módulo

### Por que isso existe (compilação separada)

Separar .h e .c permite compilação separada (separate compilation):
- cada módulo pode ser compilado independentemente
- melhora organização e manutenção
- reduz recompilação desnecessária

### Exemplo clássico

```c
// soma.h
int soma(int a, int b);  // declaração

// soma.c
int soma(int a, int b) { // definição
    return a + b;
}
```

Frase curta para prova:
- A declaração diz "isso existe".
- A definição diz "isso é assim".

## Compilação separada e múltiplos arquivos .c

### Ideia central

Em C, um projeto pode ter vários arquivos .c.
Cada arquivo .c é compilado separadamente e gera um arquivo objeto (.o), não um executável final.

### Problema típico

Se `main.c` chama uma função implementada em `soma.c`, o compilador de `main.c` precisa conhecer a declaração dessa função.

Exemplo:

```c
// main.c
int main() {
    int r = soma(2, 3);
}
```

Sem declaração de `soma`, ocorre erro de compilação (ou, no mínimo, diagnóstico de uso sem protótipo, dependendo do padrão/flags).

### Solução

Declarar no cabeçalho e incluir no arquivo que usa:

```c
// soma.h
int soma(int a, int b);

// main.c
#include "soma.h"
```

Assim, o compilador conhece:
- nome da função
- tipos dos parâmetros
- tipo de retorno

### Fluxo correto (prova)

1. Compilacao separada:

```bash
gcc -c soma.c   # gera soma.o
gcc -c main.c   # gera main.o
```

2. Ligacao (link):

```bash
gcc main.o soma.o -o programa
```

### Resumo curto

- .h diz o que existe (interface)
- .c diz como funciona (implementação)
- linker junta os objetos e resolve referencias

## C vs outras linguagens: separação e bytecode

### Declaracao e definicao em linguagens diferentes

Em algumas linguagens, não há separação explícita entre declaração e definição no estilo .h/.c.
Muitas vezes tudo aparece no mesmo arquivo ou bloco de código.

Exemplos comuns:
- Python
- JavaScript

Em C, a separacao e mais explicita:
- declaracoes em .h
- definicoes em .c

### Sobre "parcode": termo correto

O termo correto, nesse contexto, é bytecode.

Bytecode = código intermediário portátil, executado por uma VM ou interpretador.

Exemplos:
- Java -> bytecode na JVM
- Python -> bytecode executado pelo interpretador

Vantagem principal:
- maior portabilidade entre plataformas

### Diferenca central para C

- C: compilação para código de máquina específico da arquitetura alvo.
- Linguagens com bytecode: geram representação intermediária antes da execução final.

### Resumo de prova

Contraste classico:
- C -> separacao declaracao/definicao + compilacao nativa.
- Outras linguagens -> menor enfase nessa separacao + uso de bytecode/intermediario.

## Escopo vs Tempo de vida (lifetime)

### Distincao essencial

- Escopo: onde o nome pode ser usado no código.
- Tempo de vida: por quanto tempo a variável existe na memória.

Resumo de prova:
- Escopo responde "onde posso acessar?"
- Tempo de vida responde "quando existe?"

### Exemplo em C

```c
int x = 10; // escopo global, vida durante todo o programa

void f() {
    int y = 5; // escopo local, vida durante a execução de f
}
```

Leitura do exemplo:
- x: escopo global; lifetime do programa inteiro.
- y: escopo local de f; lifetime limitado a chamada de f.

### Observacao importante

Escopo e lifetime não são a mesma coisa.
Uma variável pode existir na memória e ainda assim não estar acessível em certo ponto do código.

## Criação de struct dentro de função (stack vs heap)

### Pergunta comum

É possível criar um nó (struct) dentro de uma função?
Sim. É possível declarar uma variável do tipo struct dentro da função.

Exemplo:

```c
void f() {
    struct no n;
}
```

### Interpretação correta

- A variável local é criada durante a execução da função.
- Em geral, essa variável fica na stack (alocação automática).
- Ela só existe dentro do escopo da função.
- Ao final da função, essa variável local deixa de existir.

### Exemplo com uso local

```c
void f() {
    struct no n;
    n.valor = 10;
    n.proximo = NULL;
}
```

### Quando o nó precisa sobreviver após a função

Use alocação dinâmica:

```c
struct no* criarNo() {
    struct no* n = malloc(sizeof(struct no));
    return n;
}
```

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

```c
int x;
x = 10;
```

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
