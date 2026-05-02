# Diagrama de Cancelamento:

~~~
sequenceDiagram
    actor Paciente
    participant NotificationService as Serviço de Mensageria (WhatsApp)
    participant Sistema
    participant Database as Banco de Dados
    actor Psicologo as Psicólogo

    Paciente->>NotificationService: Solicita cancelamento ou remarcação via WhatsApp
    NotificationService->>Sistema: Envia evento de cancelamento/remarcação

    Sistema->>Sistema: Recebe solicitação externa
    Sistema->>Sistema: Valida dados da solicitação (identificação do paciente e consulta)

    Sistema->>Database: Busca consulta associada ao paciente
    Database->>Sistema: Retorna dados da consulta

    alt Cancelamento de consulta
        Sistema->>Database: Atualiza status da consulta para "cancelada"
        Database->>Sistema: Confirma atualização

        opt Atualizar lista de espera
            Sistema->>Database: Verifica lista de espera da consulta
            Database->>Sistema: Retorna pacientes na lista
            Sistema->>Database: Promove próximo paciente (se aplicável)
        end

    else Remarcação de consulta
        Sistema->>Database: Verifica disponibilidade de novo horário
        Database->>Sistema: Retorna disponibilidade

        Sistema->>Database: Atualiza data e horário da consulta
        Database->>Sistema: Confirma atualização
    end

    Sistema->>NotificationService: Solicita envio de notificação

    NotificationService->>Paciente: Confirma cancelamento/remarcação
    NotificationService->>Psicologo: Notifica alteração na agenda

    Sistema->>Sistema: Finaliza processamento da solicitação

    Note over Paciente,Sistema: Processo realizado via integração externa (WhatsApp) 
~~~
---
# Diagrama de Atendimento: 

~~~
sequenceDiagram
    actor Psicologo as Psicólogo
    participant Sistema
    participant Database as Banco de Dados
    participant NotificationService as Serviço de Notificação

    Psicologo->>Sistema: Acessa sistema para realizar atendimento
    Sistema->>Database: Busca consultas agendadas do dia
    Database->>Sistema: Retorna lista de consultas
    Sistema->>Psicologo: Exibe agenda do dia

    Psicologo->>Sistema: Seleciona consulta para iniciar atendimento

    Sistema->>Database: Busca dados do paciente
    Database->>Sistema: Retorna dados do paciente

    Sistema->>Database: Busca pré-atendimento associado
    Database->>Sistema: Retorna dados do pré-atendimento

    Sistema->>Database: Busca prontuário do paciente
    Database->>Sistema: Retorna histórico clínico

    Sistema->>Psicologo: Exibe informações completas do paciente

    Psicologo->>Sistema: Inicia atendimento

    loop Durante o atendimento
        Psicologo->>Sistema: Registra anotações clínicas
        Sistema->>Database: Salva registro clínico
        Database->>Sistema: Confirma salvamento
    end

    Psicologo->>Sistema: Encerra atendimento

    Sistema->>Database: Atualiza status da consulta para "realizada"
    Database->>Sistema: Confirma atualização

    Sistema->>Database: Registra transação financeira da consulta
    Database->>Sistema: Confirma registro financeiro

    opt Enviar notificação de conclusão
        Sistema->>NotificationService: Solicita envio de confirmação
        NotificationService->>Psicologo: Confirma registro do atendimento
    end

    Sistema->>Psicologo: Exibe confirmação de atendimento finalizado

    Note over Psicologo,Sistema: Atendimento realizado com base em dados prévios do paciente
~~~
---
# Diagrama de Agendamento:
~~~
actor Psicologo as Psicólogo
    participant Sistema
    participant Database as Banco de Dados
    participant NotificationService as Serviço de Notificação
    actor Paciente

    Psicologo->>Sistema: Acessa sistema para gerenciar a agenda
    Psicologo->>Sistema: Solicita visualização da agenda
    Sistema->>Database: Consulta horários disponíveis
    Database->>Sistema: Retorna horários disponíveis
    Sistema->>Psicologo: Exibe agenda com horários disponíveis

    Psicologo->>Sistema: Seleciona horário disponível e informa paciente
    Sistema->>Sistema: Recebe solicitação de agendamento

    Sistema->>Database: Verifica disponibilidade do horário
    Database->>Sistema: Confirma disponibilidade

    Sistema->>Database: Cria registro da consulta
    Database->>Database: Armazena dados da consulta
    Database->>Sistema: Retorna confirmação de armazenamento

    Sistema->>Database: Associa consulta ao psicólogo e paciente

    opt Verificar lista de espera
        Sistema->>Database: Verifica pacientes na lista de espera
        Database->>Sistema: Retorna lista (se houver)
        Sistema->>Database: Atualiza ou remove paciente da lista
    end

    Sistema->>NotificationService: Aciona serviço de notificação
    NotificationService->>Paciente: Envia confirmação de consulta (data e horário)

    opt Agendar lembrete automático
        Sistema->>NotificationService: Agenda lembrete para a consulta
    end

    Sistema->>Psicologo: Exibe mensagem de agendamento concluído
    Note over Psicologo,Sistema: Agendamento finalizado com sucesso
~~~
---
# Diagrama de Pré-Atendimento
~~~
actor Patient
    participant System
    participant Database as Banco de Dados
    participant NotificationService as Serviço de Notificação

    Patient->>System: Acessa formulário de pré-atendimento (link externo)
    System->>Patient: Exibe formulário
    Patient->>Patient: Preenche dados pessoais
    Patient->>Patient: Preenche informações iniciais
    Patient->>Patient: Aceita termo de consentimento LGPD
    Patient->>System: Envia formulário
    
    System->>System: Valida campos obrigatórios
    System->>System: Verifica aceitação do consentimento LGPD
    
    alt Validação falha
        System->>Patient: Exibe erro de validação
        Patient->>System: Corrige e reenvia
    end
    
    System->>Database: Envia dados do pré-atendimento
    System->>Database: Envia registro de consentimento
    Database->>Database: Armazena informações
    Database->>System: Retorna confirmação de armazenamento
    
    System->>Database: Verifica se paciente já existe
    Database->>System: Retorna resultado da busca
    
    alt Paciente existe
        System->>Database: Vincula pré-atendimento ao paciente existente
    else Paciente não existe
        System->>Database: Cria novo registro de paciente
        Database->>System: Retorna ID do novo paciente
        System->>Database: Associa pré-atendimento ao novo paciente
    end
    
    System->>Database: Registra pré-atendimento como processado
    Database->>System: Confirma registro
    
    opt Aciona Serviço de Notificação
        System->>NotificationService: Envia notificação de novo pré-atendimento
        NotificationService->>NotificationService: Processa notificação
    end
    
    System->>Patient: Exibe mensagem de sucesso
    Note over Patient,System: Pré-atendimento concluído com sucesso
~~~