# Matriz de Rastreabilidade de Requisitos

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
