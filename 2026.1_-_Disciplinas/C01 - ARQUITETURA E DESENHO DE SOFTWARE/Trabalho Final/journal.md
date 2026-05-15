Hoje, 02 de maio de 2026, eu, Matheus, estou fazendo um checkpoint para entender em que ponto está o trabalho e para onde ele pode ir. A intenção, com isso, é tentar responder perguntas que têm surgido na minha cabeça, visto que me sinto perdido no trabalho.

## Perguntas do checkpoint

- [x] (a) O que é o trabalho? — respondida em [1º Checkpoint](#1º-checkpoint)
- [x] (b) O que precisa ser entregue? — respondida em [1º Checkpoint](#1º-checkpoint) e [2º Checkpoint](#2º-checkpoint)
- [x] (c) O que precisa ser entregue na primeira parte do trabalho? — respondida em [2º Checkpoint](#2º-checkpoint)
- [ ] (d) O que foi entregue? — em aberto
- [ ] (e) O que falta? — em aberto
- [ ] (f) O que pode ser entregue? — parcialmente tratado em [1º Checkpoint](#1º-checkpoint)
- [ ] (g) O que pode ser melhorado? — em aberto
- [ ] (h) Estamos no caminho certo? — em aberto

## 1º Checkpoint

Bem, o que eu estou percebendo é que está me faltando controle sobre a situação. Então vou escolher uma abordagem e começar por ela. Com isso, minha primeira escolha de entrada no checkpoint será responder: o que foi solicitado até o momento?

Com base na descrição da atividade "Entrega - Parte I", disponibilizada no Teams pela professora, foi informado que iríamos construir um sistema de software para uma clínica de psicologia. O sistema deve cumprir alguns requisitos, como (1) atividade de atendimento, (2) agendamento e/ou cancelamento de consulta, (3) lembretes e/ou avisos (sessões, pagamentos), (4) confirmação de consulta, (5) prontuário e (6) controle de pagamento. Contudo, como observação, imagino que exista margem para incluir outros requisitos no sistema, como, por exemplo, (7) um sistema de contato direto com o psicólogo (mensageria), para situações como crises em que o paciente precise de uma forma de se comunicar com o seu psicólogo, ou uma funcionalidade extra do item (2), agendamento, que implemente (2.1) um sistema de alerta de prioridade para uma consulta agendada caso o paciente precise de uma consulta de urgência em decorrência de alguma crise.

É solicitado também que o sistema de software seja implementado em uma plataforma web, com perspectiva de rodar futuramente em dispositivos móveis, e que esteja em conformidade com a Lei Geral de Proteção de Dados (LGPD). Essa parte me faz pensar em duas situações: a primeira é se existe algum problema em já implementar algo em Swift para a versão mobile, dado que eu tenho uma experiência mínima com desenvolvimento iOS, mas isso me daria margem para entregar um protótipo mínimo. A outra parte, e provavelmente a mais importante, é sobre como deve ser feita a documentação de conformidade com a LGPD e como, usualmente, essa informação aparece em documentações de sistema de software.

Certo, isso parece responder tanto à pergunta (a) "O que é o trabalho?" quanto à pergunta (b) "O que precisa ser entregue?".

## 2º Checkpoint

Continuando com a descrição da atividade no Teams, a professora define então o que é a primeira etapa do trabalho, sendo esta o Levantamento de Requisitos. Ela nos instrui a:

- Buscar documentos (leis, legislações, regulamentações, padrões ISO/IEC 25010).
- Realizar 2 entrevistas, transcrevê-las e anexá-las aos documentos, com identificação das pessoas, função e telefone.
- Aplicar 2 questionários com pessoas diferentes das entrevistadas, anexá-los com as respostas, com identificação das pessoas, função e telefone.
- Pesquisar sistemas análogos de clínicas psicológicas (pesquisar suas funcionalidades), descrevê-las e anexá-las.
- Entendimento do processo de negócio da clínica (principais dores), na notação BPMN.
- Podem ser utilizadas outras técnicas de elicitação.

### O que deve ser entregue:

- Descrição das entrevistas com identificação do entrevistado.
- Síntese dos requisitos das entrevistas.
- Entrega do questionário preenchido.
- Síntese dos requisitos dos questionários.
- Síntese dos requisitos do sistema análogo.
- Lista de requisitos - geral.
- Matriz de rastreabilidade - requisitos e fonte de requisitos.

E, por fim, a descrição da atividade termina dizendo que devemos "investigar e analisar um sistema análogo diferente do de outro grupo" e informar à professora o nome desse sistema.

No nosso caso, a escolha foi: https://www.apphealth.com.br/

## 3º Checkpoint

Com a intenção de dar sequência ao estudo da situação atual do trabalho, deparei-me com três situações distintas: acessar o link do sistema escolhido como exemplo, revisar a parte teórica que serve de base para os entregáveis e verificar o que nós, como grupo, entregamos à professora. Refletindo minimamente, entendo que precisarei passar por cada uma dessas etapas. Para começar, vou pela primeira pergunta que surgiu: como é construído o nosso sistema análogo?

### Primeira decisão

Ao acessar o site, a primeira impressão foi a predominância das cores branca e verde. É um tom específico de verde, mas a página utiliza basicamente branco e verde. Há também um botão de destaque em roxo — chamado Vizi Saúde. Preferi rolar a página em vez de clicar de imediato.

### Após navegar um pouco na página

Após navegar, observei:

1. Cabeçalho (header)

1.1. Ícones para redes sociais, no canto superior esquerdo.

1.2. Texto indicando conformidade com a LGPD, no canto superior direito; não há link associado, é apenas informativo.

2. Menu

2.1. Logo clicável que leva à página inicial, no lado esquerdo.

2.2. Menu com submenus no centro:

2.2.1. Sobre

2.2.2. Soluções

2.2.3. Blog

2.2.4. Planos e Preços

2.2.5. Contato

2.3. Dois botões com públicos distintos: o roxo (Vizi Saúde), voltado a donos de clínica interessados na rede de pacientes; e o verde, para acessar o sistema App Health.

3. Página principal

3.1. Identifiquei 14 seções destacadas.

3.1.1. A primeira apresenta o App Health como software de gestão para clínicas e hospitais, com frase objetiva e link "Agende uma demonstração" que abre conversa no WhatsApp — aparentemente um contato para clientes/equipe de atendimento, não para pacientes.

3.1.2. A segunda mostra métricas e resultados da plataforma (pacientes atendidos, agendamentos, usuários ativos etc.).

3.1.3. A terceira apresenta a funcionalidade IA App Health, que automatiza fluxos; há link para "Soluções — Inteligência Artificial".

3.1.4. A quarta trata da "Agenda Online Inteligente", com três vantagens principais; o link final redireciona para o mesmo WhatsApp da 1ª seção.

"""
Principais Vantagens

Agendamento 24h: Pacientes marcam consultas a qualquer hora, integrados ao Vizi Saúde.

Pagamento e Confirmação Online: Maior praticidade e segurança, mesmo fora do horário comercial.

Redução de No-Show: Diminua as ausências com confirmações automáticas.
"""

3.1.5. A quinta apresenta o Prontuário Eletrônico (PEP), com três vantagens, e link que redireciona para o mesmo WhatsApp.

"""
Prontuário Eletrônico (PEP): Histórico Completo, Acesso Rápido e Seguro

O Fim do Papel: Acesse todo o histórico do paciente em segundos, de qualquer lugar.

Personalização Total: Anexe fotos, documentos e emita receitas e atestados digitalmente.

Garanta agilidade e rapidez no fluxo de atendimento.
"""

3.1.6. A sexta relata feedbacks de clientes (contratantes), exibidos em cards com sistema de estrelas (1 a 5).

3.1.7. A sétima destaca a redução do no‑show, com estimativa de redução e call‑to‑action para contato via WhatsApp (provavelmente da equipe de vendas).

3.1.8. A oitava apresenta "Gestão Financeira Inteligente", com:
- Controle de fluxo de caixa, contas e repasses;
- Emissão de boletos e NF‑e;
- Controle de repasses para profissionais;
- Contas a pagar e a receber;
- Conciliação bancária.

Novamente, há botão que redireciona para o WhatsApp de atendimento/contato.

3.1.9. A nona trata da Telemedicina Integrada: atendimento online, conformidade com a LGPD (armazenamento de dados criptografados) e funcionalidades como pré‑anamnese, envio de receitas e documentos, tudo sem necessidade de apps externos.

Observação: as seções costumam terminar com um botão que leva ao WhatsApp da empresa.

3.1.10. A décima apresenta um quadro comparativo genérico com outras soluções (por exemplo, Conclínica e iClinic).

3.1.11. A décima primeira oferece a opção "Health Partner" — programa de parceria e indicação; há link para uma apresentação mais detalhada do produto.

3.1.12. A décima segunda fornece links para vídeos (depoimentos de médicos) e para o canal do YouTube, que inclui playlists com diversos depoimentos.

3.1.13. A penúltima seção reúne perguntas frequentes (FAQ), por exemplo:
- Posso migrar os dados de outro sistema?
- Vocês fazem backup dos meus dados?
- Quanto tempo leva a implantação?
- É possível realizar faturamento hospitalar no App Health?
- Posso acessar pelo celular ou tablet?
- O App Health atende diferentes especialidades?
- O sistema é seguro e está em conformidade com a LGPD?

Resposta destacada: sim — dados criptografados, ambiente seguro, autenticação e logs de auditoria; App Health afirma seguir as diretrizes da LGPD.

Observação: não está claro como a conformidade com a LGPD será documentada tecnicamente, apenas que a plataforma afirma estar em conformidade.

3.1.14. Por último, há um carrossel de cards que dá acesso ao blog institucional (≈80 páginas × 3 cards ≈ 240 postagens), sugerindo atualização frequente — a última postagem, na data de acesso, foi em 01 de maio de 2026.

4. Rodapé

4.1. Estrutura geral
- Logotipo e CTA principal: botão "Contate‑nos".
- Links de navegação: Início; Seja nosso Parceiro; Planos e Preços; Blog; Vizi; Soluções.
- Soluções (links): Inteligência Artificial; Clínicas e Policlínicas; Clínicas Multidisciplinares; Redes clínicas, franquias e planos de benefício; Gestão Hospitalar; Gestão para Psicólogos; Gestão Odontológica.
- Transparência e legal: Termos de Uso; Política de Privacidade; Política Anti‑Spam; Portal da Privacidade.
- Redes sociais e app: ícones (Instagram, Facebook, YouTube, LinkedIn) e botões para App Store e Google Play.

4.2. Conteúdo e destaques
- Carrossel do blog: grande volume de postagens e atualização frequente.
- Vídeos: depoimentos de profissionais no YouTube.
- FAQ: principais dúvidas respondidas e garantia de segurança/LGPD.

4.3. Observações
- Os CTAs ao longo do site direcionam para um número de WhatsApp da equipe de vendas/atendimento.
- O rodapé reforça navegação e contatos voltados a profissionais e clientes, mais do que a pacientes.

4.4. Identificação institucional
- © 2018–2026 App Health — Sistema para clínica e consultório médico.
- Endereço: Av. Tamandaré, 100, Sobreloja — Zona 01, CEP 87013‑210, Maringá — PR — Brasil

