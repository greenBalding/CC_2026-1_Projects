Especificação de Requisitos de Software (SRS)

# 1. Introdução

### 1.1 Objetivo

Este documento tem como objetivo formalizar e tornar de facil visibilidade os artefatos da etapa de engenharia de requisitos, visando tornar mais claro e revitar redundancias, falicitando a etapa de design.

### 1.2 Uso pretendido

O sistema será utilizado por profissionais da área da saúde para
gerenciar consultas, dados de pacientes e comunicação, com foco em
organização e segurança das informações.

### 1.3 Escopo do Produto

O sistema permitirá o cadastro de pacientes, agendamento de consultas,
envio de notificações, registro de prontuários e gerenciamento de
informações clínicas.

### 1.4 Definições e Acrônimos

-   SRS: Software Requirements Specification
-   LGPD: Lei Geral de Proteção de Dados
-   RF: Requisito Funcional
-   RNF: Requisito Não Funcional

---

# 2. Descrição Geral

### 2.1 Necessidades do Usuário

-   Organizar agenda de atendimentos
-   Reduzir faltas e conflitos
-   Registrar informações clínicas
-   Garantir sigilo
-   Facilitar comunicação

### 2.2 Pressupostos e Dependências

-   Sistema web
-   Dependência de internet
-   Integrações externas

---

# 3. Características e Requisitos do Sistema

### 3.1 Requisitos Funcionais

3.1.1 Lista

-   RF01 Cadastro de pacientes
-   RF06 Agendamento de consultas
-   RF10 Notificações
-   RF15 Prontuário
-   RF34 Cancelamento
-   RF36 Conflito de horários

3.1.2 EARS

-   Quando o paciente solicitar um horário, o sistema deverá registrar o
    agendamento.
-   Quando houver conflito, o sistema deverá alertar o profissional.

3.1.3 BDD

Funcionalidade: Agendamento
Cenário: Sucesso - Dado que há horário disponível quando o paciente agenda, então a consulta é registrada

### 3.2 Requisitos Não Funcionais

-   RNF01 Resposta em até 2 segundos
-   RNF02 Autenticação obrigatória
-   RNF03 Criptografia de dados
-   RNF04 Interface simples
-   RNF05 Disponibilidade contínua

### 3.3 Interface Externa

-   Interface web
-   Integração com WhatsApp
-   Comunicação HTTPS

### 3.4 Recursos

-   Gestão de pacientes
-   Agenda
-   Notificações
-   Prontuário

---

# 4. Outros Requisitos

### 4.1 Banco de Dados

Armazenamento consistente e seguro

### 4.2 Legais

Conformidade com LGPD

### 4.3 Internacionalização

Português

### 4.4 Riscos considerados

-   Vazamento de dados
-   Falhas externas

---
.