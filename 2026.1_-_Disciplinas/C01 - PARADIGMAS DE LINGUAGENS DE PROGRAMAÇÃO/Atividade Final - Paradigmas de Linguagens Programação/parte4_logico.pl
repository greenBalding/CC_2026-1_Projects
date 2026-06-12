% =============================================================
% Parte 4 — Implementação Lógica
% Sistema de Análise de Desempenho Acadêmico
% Paradigma: Lógico/Declarativo (Prolog)
% =============================================================

% ----- Fatos: aluno(Nome, Matricula, Nota1, Nota2, Nota3, Frequencia) -----

aluno(ana,      2024001, 8.0, 7.5, 9.0, 85).
aluno(bruno,    2024002, 5.0, 6.0, 4.5, 80).
aluno(carlos,   2024003, 7.0, 6.5, 8.0, 60).
aluno(daniela,  2024004, 9.0, 9.5, 10.0, 95).
aluno(eduardo,  2024005, 3.0, 4.0, 2.5, 70).
aluno(fernanda, 2024006, 6.0, 6.0, 6.0, 75).

% ----- Regra: calcular média -----

media(Nome, Media) :-
    aluno(Nome, _, N1, N2, N3, _),
    Media is (N1 + N2 + N3) / 3.

% ----- Regra: verificar frequência suficiente -----

frequencia_suficiente(Nome) :-
    aluno(Nome, _, _, _, _, Freq),
    Freq >= 75.

% ----- Regra: determinar aprovação -----

aprovado(Nome) :-
    media(Nome, Media),
    Media >= 6.0,
    frequencia_suficiente(Nome).

% ----- Regra: determinar reprovação -----

reprovado(Nome) :-
    aluno(Nome, _, _, _, _, _),
    \+ aprovado(Nome).

% ----- Regra: exibir situação de um aluno -----

situacao(Nome, Matricula, Media, Freq, Situacao) :-
    aluno(Nome, Matricula, _, _, _, Freq),
    media(Nome, Media),
    (aprovado(Nome) -> Situacao = aprovado ; Situacao = reprovado).

% ----- Consultas úteis -----
% Para consultar no interpretador Prolog:
%
% Listar todos os aprovados:
%   ?- aprovado(X).
%
% Listar todos os reprovados:
%   ?- reprovado(X).
%
% Ver situação de um aluno:
%   ?- situacao(ana, Mat, Media, Freq, Sit).
%
% Ver situação de todos:
%   ?- situacao(Nome, Mat, Media, Freq, Sit).

% ----- Regra para imprimir relatório -----

imprimir_aluno(Nome) :-
    situacao(Nome, Matricula, Media, Freq, Situacao),
    format("~w | ~w | Media: ~2f | Freq: ~w | ~w~n",
           [Nome, Matricula, Media, Freq, Situacao]).

relatorio :-
    write('============================================'), nl,
    write('RELATORIO - VERSAO LOGICA (PROLOG)'), nl,
    write('============================================'), nl,
    forall(aluno(Nome, _, _, _, _, _), imprimir_aluno(Nome)),
    write('============================================'), nl.
