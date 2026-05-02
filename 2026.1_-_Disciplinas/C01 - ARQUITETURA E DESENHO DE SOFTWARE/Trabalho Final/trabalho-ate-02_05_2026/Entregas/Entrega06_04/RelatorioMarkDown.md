Sistema de Gestão para Clínica de Psicologia

Levantamento de Requisitos

Alunos: Dylan Ximenes, Myllena Rodrigues, Matheus Pains, Antonio Calixto, Guilherme , Eduardo.

---

Este trabalho tem como objetivo levantar e organizar os requisitos para o desenvolvimento de um sistema web voltado para clínicas psicológicas. Foram utilizadas técnicas como entrevistas, aplicação de questionários e análise de um sistema analogo.

O atendimento psicológico envolve uma série de atividades que vão desde o agendamento das consultas até o registro das informações do paciente e controle de pagamentos. Em muitos casos, esses processos ainda são feitos de forma manual ou com o uso de ferramentas pouco integradas, como agendas físicas e aplicativos de mensagem.A partir disso, surge a necessidade de um sistema que ajude na organização dessas atividades, facilitando o trabalho do profissional.

O sistema proposto será desenvolvido para ambiente web, com possibilidade de adaptação futura para dispositivos móveis, e deve seguir as diretrizes da LGPD, já que lida com dados sensíveis.

---

# Metodologia de Levantamento:

Para entender melhor o problema, foram utilizadas três abordagens principais.

- Primeiro, foi realizada uma entrevista com uma profissional da área, buscando entender como funciona a rotina de atendimento e quais são as principais dificuldades enfrentadas.

- Além disso, foi aplicado um questionário com outros profissionais, com o objetivo de validar as informações obtidas e identificar outros pontos relevantes.

- Por fim, foi feita a análise de um sistema já existente no mercado, o App Health, para entender como soluções reais lidam com esse tipo de problema.

A LGPD e aspectos de qualidade (baseados na norma ISO/IEC 25010), foram considerados no processo de levantamento de desenvolvimento.

---

# Resultados

## 1 - Entrevista

A entrevista foi realizada com uma profissional da área de psicologia, com o objetivo de entender como funciona o atendimento na prática e identificar as principais dificuldades enfrentadas no dia a dia.

Identificação da entrevistada:
~~~
Profissão: Psicóloga
Experiência: 30 anos
Contato: (62) 99200-83375
CRP: 09/1005
~~~

A seguir estão as perguntas realizadas e as respostas obtidas:
~~~
Como você realiza o agendamento de consultas atualmente?
O agendamento é realizado por meio de agenda física e aplicativo de mensagens (WhatsApp).

Quais são as principais dificuldades no agendamento?
As principais dificuldades relatadas são: remarcações frequentes, esquecimento de consultas por parte dos pacientes e recusa ao atendimento.

Você realiza algum tipo de pré-atendimento antes da consulta?
Sim. São coletadas informações iniciais por meio de formulário ou conversa prévia, caracterizando uma etapa de triagem.

O que você considera importante coletar antes da consulta?
Histórico do paciente e motivo da consulta.

Como você armazena os prontuários dos pacientes?
No contexto atual de atuação no CREAS, os prontuários são físicos e armazenados em gavetas.

Você se preocupa com a segurança dos dados dos pacientes?
Sim. Os dados dos pacientes são considerados sensíveis e devem estar protegidos em conformidade com a LGPD.

Você utiliza algum tipo de questionário com pacientes?
Sim, principalmente no primeiro atendimento, por meio de uma ficha de acolhimento inicial.

Você realiza atendimentos online?
Não. A entrevistada relata que a modalidade online dificulta o vínculo e o contato com o usuário.

O que poderia melhorar em um sistema para clínica?
A entrevistada aponta como melhorias desejáveis: a automatização de lembretes de consulta, a organização da agenda e a centralização das informações dos pacientes em um único ambiente.
~~~
Foi possível identificar alguns pontos importantes, como o uso de ferramentas informais (agenda física e WhatsApp), dificuldades com faltas e remarcações e a necessidade de melhorar a organização das informações dos pacientes.

---

## 2 - Questionário

O questionário foi aplicado com o objetivo de complementar as informações obtidas na entrevista e verificar se os mesmos problemas também aparecem em outros contextos.

Identificação:
~~~
Nome: Maria Margareth de Moraes
Profissão: Psicóloga
Experiência: 30 anos
Contato: (62) 99200-83375
CRP: 09/1005
~~~
Respostas obtidas:
~~~
Como você realiza o agendamento de consultas?
Agenda física e aplicativo de mensagens (WhatsApp).
Você enfrenta dificuldades com agendamentos?
Sim. A respondente relata dificuldades relacionadas a cancelamentos de última hora, esquecimento de consultas por parte dos pacientes e ocorrência de conflitos de horário.
Você realiza algum tipo de pré-atendimento?
Sim.
Você utiliza questionários antes da consulta?
Sim. É utilizada uma ficha de acolhimento inicial aplicada no primeiro atendimento.
Como você armazena os dados dos pacientes?
Por meio de registros em papel e arquivos digitais.
Você considera importante a proteção dos dados dos pacientes?
Muito importante.
Você realiza atendimentos online?
Não.
Você gostaria de um sistema que integrasse agenda, prontuário e comunicação?
Sim.
O que você considera mais importante em um sistema clínico?
A escuta qualificada e a garantia do sigilo das informações compartilhadas no âmbito clínico.
~~~
De forma geral, as respostas reforçam os pontos levantados na entrevista, principalmente em relação à dificuldade de organização da agenda, uso de ferramentas não integradas e necessidade de garantir segurança no armazenamento dos dados.

---

## 3 - Sistema Análogo

Para complementar o levantamento de requisitos, foi analisado o sistema App Health, que já é utilizado por profissionais da área da saúde para auxiliar na organização de clínicas e atendimentos. O sistema funciona de forma online, podendo ser acessado em diferentes dispositivos, o que já mostra uma diferença em relação ao que foi observado na entrevista, onde ainda há uso de agenda física e ferramentas separadas.

Ao observar o funcionamento do sistema, foi possível perceber que ele concentra várias funcionalidades importantes em um único ambiente. Um dos pontos que mais chama atenção é a questão da agenda, que permite organizar horários, realizar agendamentos e ainda enviar lembretes automáticos para os pacientes. Isso ajuda a diminuir faltas e resolve um dos principais problemas citados durante o levantamento.

Outro aspecto relevante é o prontuário eletrônico, onde todas as informações do paciente ficam registradas e organizadas. Isso evita o uso de registros físicos e facilita o acesso ao histórico durante os atendimentos. Além disso, o sistema também permite o uso de formulários de pré-atendimento, o que possibilita coletar informações antes da consulta, ajudando o profissional a já ter uma noção inicial do caso.

Também foi possível notar que o sistema utiliza integração com ferramentas de comunicação, como WhatsApp e e-mail, para envio de notificações, confirmações e lembretes. Esse tipo de funcionalidade contribui para melhorar a comunicação com o paciente e tornar o processo mais eficiente.

Na parte administrativa, o sistema também oferece recursos relacionados ao controle financeiro, como registro de pagamentos, o que mostra que ele não se limita apenas ao atendimento em si, mas também auxilia na gestão da clínica como um todo.

Por fim, outro ponto importante observado foi a preocupação com a segurança das informações, principalmente por se tratar de dados sensíveis. O sistema segue diretrizes relacionadas à LGPD, garantindo maior proteção dos dados dos pacientes.

De forma geral, a análise do sistema ajudou a entender melhor como essas funcionalidades podem ser aplicadas na proposta desenvolvida neste trabalho, servindo como base para definição dos requisitos e organização das funcionalidades do sistema.


---

# Especificação de Requisitos

Com base nas informações levantadas, foram definidos os requisitos do sistema.

## Requisitos Funcionais
~~~
Gestão de Pacientes

RF01 - O sistema deve permitir o cadastro de pacientes.
RF02 - O sistema deve permitir a visualização, edição e exclusão de dados dos pacientes.
RF03 - O sistema deve permitir o registro de informações iniciais do paciente no primeiro atendimento.
RF04 - O sistema deve disponibilizar formulário de pré-atendimento para preenchimento online.
RF05 - O sistema deve armazenar os dados do pré-atendimento para consulta posterior pelo profissional.

Agenda e Consultas

RF06 - O sistema deve permitir o agendamento de consultas.
RF07 - O sistema deve permitir o acesso à agenda dos profissionais conforme nível de permissão.
RF09 - O sistema deve permitir que profissionais configurem seus horários de atendimento.
RF34 - O sistema deve permitir cancelamento e reagendamento de consultas pelo paciente.
RF35 - O sistema deve manter lista de espera para preenchimento de horários vagos.
RF36 - O sistema deve alertar o profissional sobre conflitos de horário automaticamente.
RF38 - O sistema deve registrar histórico de faltas e cancelamentos dos pacientes.

Notificações e Comunicação

RF10 - O sistema deve enviar confirmações de consultas por WhatsApp e/ou e-mail.
RF11 - O sistema deve enviar lembretes automáticos de consultas.
RF13 - O sistema deve permitir comunicação entre paciente e profissional.
RF39 - O sistema deve integrar-se com WhatsApp para envio de mensagens automáticas.

Prontuário e Dados Clínicos

RF15 - O sistema deve permitir a criação, edição e consulta de prontuários eletrônicos.
RF16 - O sistema deve armazenar o histórico clínico do paciente.
RF18 - O sistema deve permitir que o profissional visualize informações antes da consulta.
RF41 - O sistema deve permitir registro livre de anotações clínicas durante a consulta.

Financeiro

RF31 - O sistema deve registrar transações financeiras relacionadas a consultas.
~~~
---

## Requisitos Não Funcionais

~~~
Segurança

RNF01 - O sistema deve garantir a confidencialidade dos dados.
RNF03 - O sistema deve armazenar dados sensíveis conforme a LGPD.
RNF05 - O sistema deve utilizar criptografia em dados sensíveis.
RNF06 - O sistema deve utilizar HTTPS para comunicação.
RNF16 - O sistema deve garantir sigilo dos dados clínicos.
RNF17 - O sistema deve registrar consentimento do paciente para uso de dados.

Usabilidade

RNF14 - O sistema deve possuir interface simples e intuitiva.
RNF19 - O sistema deve permitir uso rápido durante a consulta.

Desempenho

RNF10 - O sistema deve estar disponível 24/7.
RNF11 - O sistema deve responder requisições em tempo adequado.

Integração

RNF15 - O sistema deve permitir integração com serviços externos, como WhatsApp.
~~~

---

## Regras de Negócio

~~~
RN01 - O sistema deve considerar a disponibilidade do profissional no momento do agendamento.
RN02 - O cancelamento de consultas deve ser registrado e impactar o histórico do paciente.
RN03 - O pré-atendimento deve ser realizado antes do primeiro atendimento.
RN04 - O acesso ao prontuário deve ser restrito ao profissional responsável.
~~~

---

# Modelagem do Sistema

Além do levantamento de requisitos, foram elaborados alguns diagramas com o objetivo de representar o funcionamento do sistema de forma mais clara.

---

## Diagrama de Casos de Uso

![Diagrama de Casos de Uso](https://github.com/DylanTanna/TrabalhoFinal/blob/main/Docs/Diagrama_de_Casos_de_Uso/CasosDeUso.png?raw=true)
---

## Diagrama de Classes

![Diagrama de Classes](https://github.com/DylanTanna/TrabalhoFinal/blob/main/Docs/Diagrama_de_Classes/DiagramaDeClasses.png?raw=true)
---

### Diagramas de Sequência - Pré Atendimento

![Pré-atendimento](https://github.com/DylanTanna/TrabalhoFinal/blob/main/Docs/Diagrama_de_Sequ%C3%AAncia/DiagramaDeSequencia_PreAtendimento.png?raw=true)
---

### Diagramas de Sequência - Agendamento

![Agendamento](https://github.com/DylanTanna/TrabalhoFinal/blob/main/Docs/Diagrama_de_Sequ%C3%AAncia/DiagramaDeSequencia_Agendamento.png?raw=true)

---

### Diagramas de Sequência - Cancelamento

![Cancelamento](https://github.com/DylanTanna/TrabalhoFinal/blob/main/Docs/Diagrama_de_Sequ%C3%AAncia/DiagramaDeSequencia_Cancelamento.png?raw=true)

---

### Diagramas de Sequência - Atendimento

![Atendimento](https://github.com/DylanTanna/TrabalhoFinal/blob/main/Docs/Diagrama_de_Sequ%C3%AAncia/DiagramaDeSequencia_Atendimento.png?raw=true)

---

# Matriz de Rastreabilidade

## Legenda

- ENT: Entrevista
- QUE: Questionário
- LGPD: Lei Geral de Proteção de Dados
- SA: Sistema Análogo

---

## Requisitos Funcionais

| ID   | Descrição                                        | Fonte    |
| ---- | -------------------------------------------------- | -------- |
| RF01 | Cadastro de pacientes                              | SA       |
| RF02 | Gerenciar dados dos pacientes                      | SA       |
| RF03 | Registro de informações no primeiro atendimento  | ENT, QUE |
| RF04 | Formulário de pré-atendimento online             | ENT      |
| RF05 | Armazenamento do pré-atendimento                  | ENT      |
| RF06 | Agendamento de consultas                           | ENT, QUE |
| RF07 | Acesso à agenda por permissão                    | SA       |
| RF08 | Agendamento 24h                                    | SA       |
| RF09 | Configuração de horários                        | ENT      |
| RF10 | Confirmações por WhatsApp/e-mail                 | ENT, QUE |
| RF11 | Lembretes automáticos                             | ENT, QUE |
| RF12 | Confirmação automática                          | SA       |
| RF13 | Comunicação paciente-profissional                | ENT      |
| RF14 | Notificações em tempo real                       | SA       |
| RF15 | Prontuário eletrônico                            | ENT, QUE |
| RF16 | Histórico clínico                                | ENT      |
| RF17 | Associação de questionários ao prontuário      | ENT, QUE |
| RF18 | Visualização antes da consulta                   | ENT      |
| RF19 | Criação de questionários                        | ENT, QUE |
| RF20 | Resposta a questionários                          | ENT, QUE |
| RF21 | Armazenamento de documentos                        | SA       |
| RF22 | Upload/download com metadados                      | SA       |
| RF23 | Validação de arquivos                            | SA       |
| RF24 | Atendimento online                                 | SA       |
| RF25 | Configuração de atendimento online               | SA       |
| RF26 | Sala de espera virtual                             | SA       |
| RF27 | Registro de consultas online                       | SA       |
| RF28 | Mensagens assíncronas                             | SA       |
| RF29 | Exclusão/anonimização de dados                  | LGPD     |
| RF30 | Logs de acesso                                     | LGPD     |
| RF31 | Registro financeiro                                | SA       |
| RF32 | Sugestão automática de preenchimento             | SA       |
| RF33 | Classificação de risco                           | SA       |
| RF34 | Cancelamento e reagendamento                       | ENT, QUE |
| RF35 | Lista de espera                                    | SA       |
| RF36 | Alerta de conflito de horário                     | ENT, QUE |
| RF37 | Confirmação ativa pelo paciente                  | QUE      |
| RF38 | Histórico de faltas                               | ENT, QUE |
| RF39 | Integração com WhatsApp                          | ENT, QUE |
| RF40 | Questionário obrigatório no primeiro atendimento | ENT, QUE |
| RF41 | Anotações clínicas livres                       | ENT      |

---

## Requisitos Não Funcionais

### Segurança

| ID    | Descrição                              | Fonte          |
| ----- | ---------------------------------------- | -------------- |
| RNF01 | Confidencialidade dos dados              | ENT, QUE, LGPD |
| RNF02 | Proteção contra acesso não autorizado | LGPD           |
| RNF03 | Armazenamento conforme LGPD              | ENT, QUE, LGPD |
| RNF04 | Criptografia de senhas                   | LGPD           |
| RNF05 | Criptografia de dados sensíveis         | LGPD           |
| RNF06 | Uso de HTTPS                             | LGPD           |
| RNF16 | Sigilo absoluto dos dados clínicos      | ENT, QUE, LGPD |
| RNF17 | Consentimento do paciente                | LGPD           |
| RNF18 | Controle de acesso por paciente          | LGPD           |

---

### Controle de Acesso

| ID    | Descrição                          | Fonte     |
| ----- | ------------------------------------ | --------- |
| RNF07 | Autenticação                       | SA        |
| RNF08 | Níveis de permissão                | SA        |
| RNF09 | Restrição de acesso a prontuários | ENT, LGPD |

---

### Desempenho

| ID    | Descrição          | Fonte |
| ----- | -------------------- | ----- |
| RNF10 | Disponibilidade 24/7 | SA    |
| RNF11 | Tempo de resposta    | SA    |
| RNF12 | Múltiplos usuários | SA    |
| RNF13 | Escalabilidade       | SA    |

---

### Usabilidade

| ID    | Descrição                  | Fonte    |
| ----- | ---------------------------- | -------- |
| RNF14 | Interface simples            | ENT, QUE |
| RNF19 | Uso rápido durante consulta | ENT      |

---

### Integração

| ID    | Descrição                         | Fonte        |
| ----- | ----------------------------------- | ------------ |
| RNF15 | Integração com serviços externos | ENT, QUE, SA |


---

Referências

* Lei Geral de Proteção de Dados (LGPD)
* ISO/IEC 25010
* App Health
