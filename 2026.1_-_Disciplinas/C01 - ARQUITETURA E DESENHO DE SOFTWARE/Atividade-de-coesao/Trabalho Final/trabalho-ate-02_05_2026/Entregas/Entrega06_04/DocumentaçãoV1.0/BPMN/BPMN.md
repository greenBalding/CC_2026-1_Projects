# Modelagem de Processo - BPMN

## Descrição

Este diagrama BPMN representa o processo de atendimento em uma clínica de psicologia, considerando as interações entre paciente, psicólogo e sistema.

O fluxo inicia com a solicitação de agendamento por parte do paciente, seguido pela verificação de disponibilidade e agendamento da consulta pelo profissional. O sistema realiza o envio de confirmação e notificações, permitindo que o paciente confirme ou solicite remarcação.

Após a confirmação, o sistema disponibiliza o formulário de pré-atendimento, que deve ser preenchido pelo paciente antes da consulta. No horário agendado, a consulta é iniciada, permitindo ao profissional acessar e registrar informações no prontuário eletrônico. Ao final, os dados são salvos e a consulta é marcada como concluída.

---

## Contexto

Este diagrama foi elaborado no dia **13/04**, com base nos requisitos levantados na Fase 1 do projeto.

A modelagem considera as principais necessidades identificadas durante o levantamento de requisitos, incluindo organização da agenda, comunicação com pacientes, registro de informações clínicas e segurança dos dados.

---

## Observação

Este modelo de processo representa uma visão inicial do sistema e poderá sofrer alterações ao longo do desenvolvimento do projeto, conforme novas análises, validações e refinamentos dos requisitos forem realizados.

---

## Relação com os Requisitos

O fluxo modelado neste diagrama está diretamente relacionado aos seguintes requisitos funcionais e não funcionais:

### Requisitos Funcionais

- RF03 - Registro de informações iniciais do paciente antes da consulta
- RF04 - Formulário de pré-atendimento online
- RF05 - Armazenamento dos dados do pré-atendimento
- RF06 - Agendamento de consultas
- RF09 - Configuração de horários de atendimento
- RF10 - Envio de confirmação de consultas
- RF12 - Confirmação automática de consultas
- RF13 - Comunicação entre paciente e profissional
- RF14 - Notificações em tempo real
- RF15 - Criação e gestão de prontuários
- RF16 - Armazenamento do histórico clínico
- RF18 - Visualização de informações antes da consulta

---

## Considerações Finais

A modelagem BPMN auxilia na compreensão do funcionamento do sistema proposto, permitindo identificar pontos de melhoria no processo atual, como redução de faltas, automação de confirmações e melhor organização das informações clínicas.

Este artefato também contribui para a validação dos requisitos levantados, garantindo maior alinhamento entre as necessidades do domínio e a solução proposta.
