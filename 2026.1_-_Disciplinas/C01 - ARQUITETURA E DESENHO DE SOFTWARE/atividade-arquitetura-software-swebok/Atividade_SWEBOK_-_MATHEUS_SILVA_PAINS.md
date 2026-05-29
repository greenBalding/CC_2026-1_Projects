# Atividade sobre o cap. Arquitetura de Software SWEBOK
# Aluno: Matheus Silva Pains - 2024.2.0028.0032-0

--- 

Distribuição de resoluções:

Dia 1: Q1 - Q7
Dia 2: Q8 - Q14
Dia 3: Q15 - Q20

---

## Q1. Segundo o SWEBOK, em quantos e quais sentidos o termo "arquitetura" é empregado na engenharia de software? [página 67 do material de apoio]

    Segundo o SWEBOK, no Capítulo 2, logo no item 1 ele discorre sobre os Fundamentos da Arquitetura de Software. Ele começa dizendo que a Engenharia de Software e as disciplinas relacionadas se valem de muitos sentidos sobre o que é "Arquitetura". Em um primeiro momento "Arquitetura" pode ser definida com uma disciplina. A arte e a ciência de construir coisas. Por essa perspecita a disciplina envolveria conceitos, principios, processos e metodos que a própria comunidade descobriu e adotou.

    Na segunda concepção, "Arquitetura" refere-se ao vários processos que essa disciplina se relaciona. Nela, a arquitetura de software é considerada parte também do design de software. Ao qual geralmente se vincula uma abordagem de várias etapas para o processo e que pode ser dívidia no "Estágio de design de arquitetura", "Estágio de design high-level" e "Estágio de design detalhado".
    
    Na terceira concepção, "Arquitetura" refere-se para o resultado de ter aplicado o design de arquitetura como disciplina e processo para gerar arquiteturas para sistemas de software. Diz que arquiteturas como resultados são expressas em Descrições de Arquitetura. 

## Q2. O que são stakeholders e concerns no contexto de arquitetura? Por que eles importam? 

    Ainda no capítulo 2, no item 1.2 ele discorre sobre Stakeholders e Concerns. Ele começa dizendo que um sistema de software possui varios stakeholders e que desempenha vários papéis e interesses em relação ao sistma. Essa variação de interesses recebem o termo de Concerns.

    Em um primeiro momento, para detalhar esses papéis com exemplos práticos, o texto aponta que o cliente do sistema costuma estar mais interessado em saber quando o produto estará pronto e quanto custará para construir e operar, enquanto os usuários tendem a focar prioritariamente no que ele faz e em como usá-lo. Por outro lado, os designers e programadores que constroem o sistema possuem preocupações de natureza técnica, como a capacidade de um algoritmo satisfazer os requisitos, ao passo que os encarregados de garantir a segurança da operação demonstram focos inteiramente distintos.

    Na concepção do porquê eles importam, nota-se que essas preocupações abrangem uma vasta gama de aspectos e influências sobre o sistema em seu ambiente — incluindo fatores de desenvolvimento, tecnológicos, de negócios, operacionais, organizacionais, regulatórios, econômicos e sociais. É possível observar que elas importam significativamente porque moldam a arquitetura e os artefatos de Descrição de Arquitetura, manifestando-se sob a forma de requisitos, atributos de qualidade (ou "ilities"), propriedades emergentes e restrições. Como essas preocupações não costumam ser estáticas e evoluem junto com as tecnologias e políticas ao longo do ciclo de vida do sistema, compreendê-las auxilia a guiar as decisões de design mais significativas e a manter o entendimento compartilhado por todos os envolvidos.

## Q3. Cite ao menos 4 usos práticos de uma arquitetura de software em uma organização. 

    No Capítulo 2, no item 1.3, o SWEBOK aborda os usos práticos da arquitetura dentro de um contexto organizacional. Em um primeiro momento, aponta-se que a principal utilidade consiste em fornecer a todas as pessoas que trabalham no projeto uma compreensão compartilhada do sistema, servindo como um guia estrutural para o seu design e construção.

    Em um segundo momento, a arquitetura funciona como uma concepção preliminar do sistema de software, o que viabiliza uma base concreta para analisar e avaliar diferentes alternativas e soluções técnicas antes que recursos significativos sejam investidos. Na terceira acepção, ela atua de maneira estratégica ao permitir processos de engenharia reversa (ou retroarquitetura), auxiliando as equipes a compreenderem a fundo sistemas existentes e complexos antes de realizarem manutenções, melhorias ou modificações substanciais.

    Por fim, observa-se que o conhecimento consolidado da arquitetura permite que cada segmento da organização embase suas atividades de planejamento, estimativa de custos e definição de cronogramas. Além disso, ela estabelece as bases para o desenvolvimento de famílias de programas ou linhas de produto de software, permitindo identificar pontos comuns e projetar componentes reutilizáveis e customizáveis que reduzem o esforço de engenharia subsequente.

## Q4. O que é um Architecturally Significant Requirement (ASR) e como ele se diferencia de um requisito comum? 

    No contexto do processo de design arquitetural, detalhado no item 3.2.1, o SWEBOK define um Requisito Arquiteturalmente Significativo (ASR) como qualquer requisito imposto a um sistema de software que exerça uma influência direcionadora e marcante em sua arquitetura. Eles representam, essencialmente, os problemas técnicos de maior relevância que a estrutura precisa solucionar de forma prioritária.

    Na concepção de sua diferenciação em relação aos requisitos comuns, nota-se uma separação descrita no item 3.1. Enquanto os requisitos comuns ou convencionais costumam tratar de regras de negócio locais ou funcionalidades específicas que podem ser adiadas para estágios posteriores do desenvolvimento — como o design detalhado ou a construção —, os ASRs atuam como os chamados direcionadores arquiteturais. 

    Desse modo, os ASRs moldam as decisões mais críticas e estruturais do sistema, envolvendo frequentemente atributos de qualidade complexos (como escalabilidade, segurança e desempenho) e restrições de infraestrutura que não podem ser alteradas facilmente no futuro sem incorrer em custos proibitivos.

## Q5. Qual a diferença entre view e viewpoint em arquitetura de software? 

    No item 2.1 do segundo capítulo, o texto esclarece os conceitos de visões e pontos de vista, mapeando como eles se articulam na descrição de um sistema. Em um primeiro momento, define-se uma visão arquitetural como a representação de um ou mais aspectos específicos da arquitetura, estruturada propositalmente para abordar preocupações delimitadas de determinados stakeholders por meio de modelos e notações apropriadas.

    Por outro lado, um ponto de vista arquitetural funciona como o conjunto de convenções, regras e idiomas que determinam as diretrizes de como uma visão correspondente deve ser construída, interpretada e utilizada. O ponto de vista estabelece, portanto, as linguagens de modelagem e os padrões que guiarão o arquiteto na estruturação daquela visão.

    Em suma, constata-se que a diferença fundamental reside no fato de o viewpoint funcionar como um gabarito, especificação ou padrão reutilizável de documentação, enquanto a view constitui a instância real ou a aplicação prática dessas convenções para mapear a estrutura de um sistema de software específico.

## Q6. O SWEBOK lista vários estilos arquiteturais. Cite 4 deles e dê um contexto em que cada um seria adequado.

    Ao discorrer sobre os padrões e estilos arquiteturais no item 2.2, o material categoriza diversas abordagens consagradas na engenharia de software. Um primeiro exemplo mencionado é o estilo em Camadas, considerado altamente adequado para cenários nos quais existe a necessidade de organizar o sistema em níveis crescentes de abstração, garantindo o desacoplamento e assegurando que as dependências fluam estritamente em uma única direção.

    Um segundo estilo citado é o de Tubos e Filtros, cuja aplicação se mostra ideal em contextos de processamento de fluxos de dados nos quais a informação deve passar por uma sequência disposta de transformações independentes, onde o resultado de uma etapa serve diretamente como entrada para a seguinte.

    No âmbito de sistemas distribuídos, aponta-se o estilo Cliente-Servidor, o qual se apresenta apropriado para cenários nos quais múltiplos clientes independentes ou estações de trabalho necessitam acessar de forma coordenada recursos, dados ou serviços hospedados de maneira centralizada.

    Por fim, pode-se destacar o estilo de Microsserviços, cujo emprego costuma ser recomendado para ecossistemas de software complexos e de grande porte que demandem alta escalabilidade granular, capacidade de implantação isolada de seus componentes e agilidade para que equipes distintas trabalhem e evoluam o código de forma autônoma.

## Q7. O que diferencia um padrão arquitetural de um estilo arquitetural?

    Ainda sob a perspectiva do item 2.2, o SWEBOK aponta que não há uma linha divisória perfeitamente rígida entre os dois conceitos, uma vez que ambos se propõem a fornecer soluções consolidadas para problemas em contextos determinados. No entanto, é possível extrair nuances que os diferenciam em termos de escopo e nível de abrangência no sistema.

    Em um primeiro momento, o estilo arquitetural é compreendido como uma maneira particular de construção que confere características marcantes à organização global e em grande escala do sistema de software, definindo suas partes estruturais e as formas gerais de interação entre elas.

    Inversamente, um padrão arquitetural expressa uma solução comum e testada para um problema recorrente dentro do contexto do sistema, não necessitando obrigatoriamente se aplicar à totalidade da aplicação. Nota-se que os padrões arquiteturais existem em escalas variadas, podendo ser empregados de maneira pontual em um único elemento ou aplicados repetidamente ao longo de diferentes módulos, inclusive servindo como expressões ou idiomas específicos para materializar as diretrizes de um determinado estilo arquitetural.

## Q8. O que é uma Architecture Description Language (ADL)? Cite exemplos mencionados no capítulo. 

    No item 2.3, o texto aborda as Linguagens de Descrição de Arquitetura (ADLs), caracterizando-as como linguagens de domínio específico desenvolvidas expressamente para representar e modelar arquiteturas de software. Historicamente, aponta-se que elas evoluíram a partir das linguagens de interconexão de módulos voltadas para a chamada programação em grande escala.

    Com base no texto, nota-se que algumas ADLs possuem focos restritos a um único domínio de aplicação ou estilo específico, enquanto outras apresentam um espectro mais amplo voltado a enquadrar preocupações corporativas globais. Além do papel descritivo, muitas dessas linguagens oferecem recursos automatizados para realizar análises estáticas complexas, simulações ou geração automática de código.

    Como exemplos explícitos de linguagens ou representações citadas no capítulo, o SWEBOK menciona a MetaH, voltada para sistemas aviônicos estruturados em estilo orientado a eventos; a ArchiMate, que possui um espectro amplo para modelagem de arquitetura corporativa; e a Unified Modeling Language (UML), frequentemente empregada com propósitos de ADL devido à sua ampla adoção nas atividades cotidianas de design da indústria.

## Q9. Explique o conceito de arquitetura como decisões significativas.

    No item 2.4, discorre-se sobre a visão da arquitetura sob a ótica das decisões significativas. Sob essa perspectiva, o design arquitetural deixa de ser compreendido apenas como um arranjo estático de diagramas e passa a ser visto como o resultado de um processo contínuo e encadeado de tomadas de decisão que impactam profundamente o desenvolvimento e o ciclo de vida do software.

    Observa-se que esse processo gera uma rede complexa de decisões, em que escolhas subsequentes derivam logicamente de resoluções anteriores. Essas definições costumam se basear nas preocupações mais proeminentes dos stakeholders, nas restrições de recursos e, principalmente, nos compromissos e compensações entre atributos de qualidade concorrentes.

    O texto enfatiza a conveniência de documentar explicitamente não apenas as decisões tomadas, mas também as justificativas, as premissas adotadas e as alternativas que foram avaliadas e rejeitadas. Essa prática se mostra valiosa porque previne que o projeto repita erros no futuro por esquecimento dos motivos originais ou permite que os desenvolvedores reavaliem escolhas passadas quando as condições de contorno do ambiente mudarem.

## Q10. Qual a diferença fundamental entre arquitetura e design segundo o SWEBOK? 

## Q11. Descreva o modelo geral de design arquitetural proposto no capítulo, incluindo suas 3 atividades principais. 

## Q12. O que é architectural technical debt? 

## Q13. O que significa "architecting in the large"? 

## Q14. Qual é o papel da análise no processo arquitetural? 

## Q15. O que significa "goodness" (bondade) em arquitetura? Quais critérios são usados para avaliá-la? 

## Q16. Explique brevemente os métodos ATAM, SAAM.

## Q17. Qual é o propósito das revisões de arquitetura e como elas diferem das revisões de código comuns? 

## Q18. Cite 3 métricas arquiteturais mencionadas no capítulo e explique o que cada uma mede. 

## Q19. Explique a Lei de Conway e sua relação com arquitetura de software. 

## Q20.  O que é uma arquitetura de referência? 