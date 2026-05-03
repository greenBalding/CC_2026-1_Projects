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

Com a intenção de dar sequência ao estudo da situação atual do trabalho, eu me deparei com 3 situações distintas, sendo elas: acessar o link do sistema escolhido como exemplo, revisar a parte teórica que serve de base para os entregáveis e ver o que a gente, como grupo, entregou para a professora. E, refletindo minimamente, entendo que eventualmente terei que passar por cada uma dessas etapas. Para isso, estou tomando a decisão de não pensar muito e ir pela primeira pergunta que surgiu: como é construído o nosso sistema análogo?

### Primeira decisão

Bem, ao acessar o site, o que vejo primeiro é uma predominância das cores branca e verde. É um tom específico de verde, mas a primeira impressão é de um site com duas cores principais, branco e verde. Existe, contudo, um botão de destaque em roxo — chamado Vizi Saúde. Ainda assim, não me dá vontade de clicar em um primeiro momento, mas sim de rolar a página.

### Após navegar um pouco na página

Após navegar um pouco na página, o que eu vejo:

1. Header

1.1. Um header com ícones que levam para redes sociais, no canto superior esquerdo.

1.2. Um header com um texto que diz que a plataforma está adequada à LGPD, no canto superior direito. Contudo, não existe nenhuma opção de clicar e ser direcionado para alguma página. É apenas um texto.

2. Menu

2.1. O logo do sistema, clicável e que leva à página inicial do site, fica no lado esquerdo.

2.2. Menu com submenus, que ficam no meio:

2.2.1. Sobre;

2.2.2. Soluções;

2.2.3. Blog;

2.2.4. Planos e Preços;

2.2.5. Contato.

2.3. Dois botões que parecem ter dois públicos diferentes. O botão roxo parece oferecer aos donos de clínicas a possibilidade de se conectarem a um ecossistema de rede de pacientes, que permite que a clínica seja exposta a novos pacientes em potencial. Já o botão verde fica responsável por acessar o sistema do App Health, de fato.

3. Página principal

3.1. Consigo identificar 14 seções que estão visivelmente destacadas.

3.1.1. A primeira identifica o App Health como um software de gestão médica para clínicas e hospitais, com uma oração objetiva e direta e com um link para "Agende uma demonstração" que leva a uma conversa no WhatsApp. Não cheguei a acessar, mas entende-se que seja um link para clientes e não para pacientes. Parece ser um link para uma equipe de atendimento sobre o produto App Health e não para atendimentos de pacientes. Como é um link para um número de WhatsApp específico, eu não cheguei a interagir.

3.1.2. A segunda é reservada para apresentação de dados sobre os resultados da plataforma até a última atualização do site, como, por exemplo, quantos pacientes já foram atendidos na plataforma, a quantidade de agendamentos, usuários ativos etc.

3.1.3. A terceira se dedica a apresentar uma nova funcionalidade ao cliente: a IA App Health, que automatiza fluxos de forma natural e integrada. Há também um link para aprofundar sobre a funcionalidade, que redireciona para o submenu "Soluções - Inteligência Artificial".

3.1.4. A quarta parte se dedica a outra funcionalidade, "Agenda Online Inteligente", com a apresentação de três vantagens principais. O link de acesso ao final redireciona para o mesmo número de WhatsApp da 1ª seção.

"""
Principais Vantagens

Agendamento 24h: Pacientes marcam consultas a qualquer hora, integrados ao Vizi Saúde.

Pagamento e Confirmação Online: Maior praticidade e segurança, mesmo fora do horário comercial.

Redução de No-Show: Diminua as ausências com confirmações automáticas.
"""

3.1.5. A quinta parte se dedica a apresentar mais uma funcionalidade: o Prontuário Eletrônico (PEP), apresentando novamente três vantagens e com o link de acesso que redireciona para o mesmo número de WhatsApp.

"""
Prontuário Eletrônico (PEP): Histórico Completo, Acesso Rápido e Seguro

O Fim do Papel: Acesse todo o histórico do paciente em segundos, de qualquer lugar.

Personalização Total: Anexe fotos, documentos e emita receitas e atestados digitalmente.

Garanta agilidade e rapidez no fluxo de atendimento.
"""

3.1.6. A sexta parte se dedica a relatar feedbacks de quem utiliza a plataforma App Health. Nota-se que os feedbacks são de usuários que contratam a plataforma e não de pacientes. A apresentação dos feedbacks é feita via cards com sistema de notas no padrão de estrelas (de 1 a 5).

3.1.7. A sétima parte se dedica a apresentar uma vantagem da contratação do sistema, que é a redução do no-show. Informa ao contratante como será feito e traz uma estimativa da redução do no-show. Ao final, também direciona o usuário a entrar em contato com o mesmo número de WhatsApp. Imagino, a esse ponto, que, como cada botão tem uma mensagem imperativa convidando o usuário a interagir com o sistema, esse número seja da equipe de produto da App Health.