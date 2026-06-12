% Parte 4 - Implementacao Logica (Prolog)
% Sistema de Analise de Desempenho Academico

% Fatos: aluno(Nome, Matricula, Nota1, Nota2, Nota3, Frequencia)

aluno(ana,       2024001, 8.0, 7.5, 9.0, 85).
aluno(bruno,     2024002, 5.0, 6.0, 4.5, 80).
aluno(carlos,    2024003, 7.0, 6.5, 8.0, 60).
aluno(daniela,   2024004, 9.0, 9.5, 10.0, 95).
aluno(amanda,    2024005, 10.0, 9.0, 10.0, 100).
aluno(guilherme, 2024006, 9.0, 10.0, 10.0, 100).
aluno(matheus,   2024007, 10.0, 10.0, 9.0, 100).

% Regra: calcular media
media(Nome, Media) :-
    aluno(Nome, _, N1, N2, N3, _),
    Media is (N1 + N2 + N3) / 3.

% Regra: verificar frequencia
frequencia_ok(Nome) :-
    aluno(Nome, _, _, _, _, Freq),
    Freq >= 75.

% Regra: aprovado
aprovado(Nome) :-
    media(Nome, Media),
    Media >= 6.0,
    frequencia_ok(Nome).

% Regra: reprovado
reprovado(Nome) :-
    aluno(Nome, _, _, _, _, _),
    \+ aprovado(Nome).

% Consultas:
%   ?- aprovado(X).
%   ?- reprovado(X).
%   ?- media(ana, M).
