# Rei e Conquistador — Game Design Document (v0.3)

> Documento de reconstrução. **Rei e Conquistador** original foi um browser MMO de
> estratégia hospedado em `br.337.com` (portal 337 Technology Limited / UOL Jogos),
> lançado por volta de 2010 e encerrado em algum momento entre 2012 e a atualidade —
> sem sucessor oficial. Este documento reconstrói os sistemas do jogo a partir de
> pesquisa (páginas arquivadas, comentários de comunidade, um vídeo de gameplay de
> 2012) **e da memória direta do autor, que jogou o original**, como ponto de
> partida para um **remake/homenagem moderno** — não como cópia de assets ou código
> originais. Nome, arte e strings específicas do jogo original não são
> reaproveitados — apenas os sistemas e a sensação de jogo.
>
> **Este é um documento vivo.** A reconstrução é feita de memória (não existe GDD
> original preservado) — mudanças frequentes, inclusive retroativas, são esperadas
> ao longo do projeto. Ver changelog abaixo.

## Changelog

| Versão | Mudança |
|---|---|
| v0.3 | Separa nível de jogador (conta) e nível de herói — o cap de Lv 54→80 é do **jogador**, não do herói. Adiciona hierarquia de rank de herói (Conde → Visconde → Visconde Superior → Marquês → Duque → Deus, ligada à cor do equipamento) e o sistema de Cartas de Herói (aquisição por sorte, compradas no mercado ou ganhas em missão). Confirma que a mitologia grega existia de fato (heróis Deus = deuses gregos). Resolve o Sistema de Posses como evento mensal. Resolve o Mercado como sistema misto (loja do sistema + comércio entre jogadores). Remove a crítica ao "item barato por bug" — era um workaround de presente entre amigos, preservado de propósito. |
| v0.2 | Adiciona economia entre jogadores (mercado), Mapa do Mundo (estilo Tribal Wars, castelos NPC, minas no mapa), Sistema de Posses (disputa de território entre guildas), sistema de Guildas detalhado (estilo Tribal Wars), nível máximo definido em Lv 80 (original era Lv 54). |
| v0.1 | Primeira versão: facções, loop principal, recursos, construção, herói, exército, guildas (básico), monetização, stack técnica. |

## 1. Pitch

Um MMO de estratégia em navegador onde o jogador governa uma cidade, desenvolve um
herói e disputa território contra outros jogadores em um mundo persistente
compartilhado — a base de "construção + PvP assíncrono" de jogos como Tribal Wars,
somada a uma camada de progressão de herói/RPG, uma escolha de facção com
identidade própria, e uma economia viva sustentada pelos próprios jogadores.

**Pilares de design:**
1. **Cidade viva** — toda decisão de construção tem custo/tempo real e compete com
   outras prioridades (economia vs. exército vs. tecnologia).
2. **Herói como personagem, não como stat** — o herói progride, equipa itens e tem
   identidade visual, ao contrário de jogos puramente numéricos.
3. **Facção com peso narrativo** — a escolha entre as três facções afeta estética,
   unidades e (futuramente) narrativa de servidor, não é só reskin.
4. **Mundo compartilhado e disputável** — o mapa é uma entidade viva: castelos de
   NPC, minas neutras e territórios de guilda existem fora da sua cidade e podem
   ser tomados por qualquer jogador ou guilda.
5. **Economia entre jogadores** — comércio de recursos e itens entre jogadores é um
   sistema central, não um extra. A economia do servidor é, em grande parte,
   PvP econômico.
6. **PvP assíncrono e social** — combate e diplomacia acontecem mesmo com o jogador
   offline; guildas e chat são centrais, não acessórios.
7. **Sem pay-to-win** — monetização cosmética/conveniência apenas (ver seção 11).

## 2. Facções

Três facções selecionáveis na criação de personagem, cada uma com estilo de arte e
unidades próprios:

| Facção | Tema | Identidade de combate (a definir em balanceamento) |
|---|---|---|
| **Império dos Homens** | Reino medieval clássico, cavalaria e infantaria disciplinada | Equilibrado, forte em defesa organizada |
| **Tribos de Orc** | Clãs tribais, força bruta, xamanismo | Forte em ataque/velocidade, mais frágil na defesa |
| **Domínio do Caos** | Culto sombrio, criaturas corrompidas | Unidades especiais/mágicas, alto risco-recompensa |

Cada facção tem uma tela de lore própria na criação de personagem (estandarte +
texto curto de flavor) — a reconstruir com escrita original.

> **Confirmado pelo autor**: a mitologia grega existia de fato no jogo original —
> não é ruído de pesquisa. Ela se manifesta especificamente através do rank
> **Deus** de herói (deuses gregos como Atena, Poseidon, Apolo, Hermes — ver seção
> 7.2), não como uma quarta facção. Resta confirmar se também existia, à parte
> disso, um sistema de "jurar fidelidade a uma divindade" (mencionado em uma fonte
> secundária) — pode ser a mesma coisa vista de fora por quem não jogou, ou um
> sistema paralelo. Ver seção 13.

## 3. Loop principal

```
Coletar recursos (passivo, por hora, na própria cidade)
        │
        ▼
Construir / evoluir prédios ──► Desbloquear unidades e tecnologias
        │                              │
        ▼                              ▼
Treinar exército                 Evoluir jogador (até Lv 80) e coletar/evoluir heróis
        │                              │
        ├──────────────┬───────────────┘
        ▼               ▼
Atacar/ocupar mapa   Comerciar com outros jogadores
(castelos NPC,       (recursos e itens — economia viva)
 minas, Posses)
        │
        ▼
Cumprir quests, defender território, guerra de guilda
        │
        ▼
Ganhar pontuação, recursos, itens, guilda cresce, servidor evolui
        │
        └──► volta ao topo (loop de médio prazo: horas/dias)
```

Sessões curtas (checar produção, coletar quest, reforçar defesa, checar mercado) e
sessões longas (planejar ataque, evoluir tech tree, negociar com outra guilda)
devem ser ambas viáveis — jogo assíncrono por natureza (produção continua offline,
mas território pode ser perdido offline também).

## 4. Recursos e economia entre jogadores

Quatro recursos base, cada um com prédio de produção dedicado na própria cidade
(produção em unidades/hora, visível na UI principal):

| Recurso | Prédio produtor (na cidade) | Uso principal |
|---|---|---|
| Madeira | Moinho de Madeira | Construção, unidades básicas |
| Pedra | Pedreira | Construção, defesas |
| Ferro | Mina de Ferro | Unidades avançadas, equipamentos |
| Ouro | Tesouraria / comércio | Upgrades caros, contratação de mercenários, mercado |

Cada prédio de recurso tem: nível atual, produção/hora atual, e custo (nos 4
recursos + tempo) para o próximo nível — visto diretamente em tooltip no jogo
original.

### 4.1 Mercado entre jogadores (pilar central)

Confirmado pela memória do autor como **extremamente importante** no original — a
economia do servidor era sustentada pelos próprios jogadores, não só pela produção
individual. **Era um sistema misto**, com duas camadas que coexistem:

- **Loja do sistema**: o próprio jogo oferecia produtos/recursos à venda para
  ajudar a criar e sustentar a economia do servidor — uma espécie de piso/seed de
  oferta, evitando que a economia trave por falta total de liquidez.
- **Mercado entre jogadores**: jogadores compravam e vendiam recursos e itens uns
  dos outros diretamente — a camada social e mais importante, onde a maior parte
  do valor real circulava.
- **Caravanas**: envio físico de recursos entre cidades tem tempo de viagem e é
  **interceptável** por outro jogador no mapa (arriscar o comércio é parte do
  jogo) — coerente com o fato de o mapa ser uma entidade viva (seção 5).
- Excedente de produção (ex.: uma cidade especializada em Ferro) só tem valor se
  puder ser escoado — o mercado é o que torna a especialização de cidade uma
  escolha real, em vez de todo mundo construir os mesmos 4 prédios na mesma
  proporção.
- **Preço livre, de propósito**: o jogo não permitia presentear itens
  diretamente entre contas — então jogadores usavam o mercado como workaround:
  listar um item por um preço simbólico (ex. 2 de ouro) para um amigo comprar.
  Isso é nostálgico e **deve ser preservado deliberadamente** na reconstrução —
  não adicionar piso de preço "anti-abuso" que mataria esse comportamento
  (ver também seção 11).

## 5. Mapa do Mundo

O mapa é clicável e navegável, no estilo Tribal Wars — uma grade compartilhada por
todos os jogadores do servidor, com múltiplos tipos de ponto de interesse além das
cidades dos jogadores:

- **Castelos de NPC**: fortalezas neutras controladas por IA, atacáveis por
  qualquer jogador. Funcionam como o equivalente a "aldeias bárbaras" do Tribal
  Wars — servem de alvo de treino, fonte de loot/recursos e, possivelmente,
  território ocupável.
- **Minas no mapa** (Ferro, Ouro, Madeira): diferente dos prédios de produção
  internos da cidade (seção 4), estas são **nós neutros no mapa mundial** que
  qualquer jogador pode enviar tropas para ocupar/explorar, gerando uma segunda
  camada de produção de recursos — competitiva, finita por região, e uma das
  principais razões para expandir território.
- **Cidades de outros jogadores**: alvo de ataque/espionagem, com todas as
  consequências de PvP direto (saque, dano a prédios, captura de recursos em
  trânsito).
- **Territórios de guilda ("Posses")**: ver seção 6 — uma camada separada e mais
  estratégica de controle de área.

O mapa deve suportar zoom (visão geral do servidor) e clique em tile individual
para ver detalhes/enviar tropas — interação direta, não só uma lista de
coordenadas.

## 6. Sistema de Posses (território de guilda)

Sistema confirmado pela memória do autor como um dos pilares de PvP em guilda do
jogo original:

- **Evento mensal** (segundo a memória do autor — ele mesmo não tem certeza
  absoluta da periodicidade exata): periodicamente, **áreas específicas do mapa
  "abrem" para disputa** entre guildas. Tratar "mensal" como a hipótese de
  trabalho até confirmação; a duração exata da janela de disputa dentro do mês
  ainda é uma incógnita (seção 13).
- Cada Posse concede um **bônus territorial** enquanto controlada: bônus de
  produção de Ouro, Ferro ou Madeira para a guilda inteira, ou bônus de
  progressão/atributo para heróis (ex.: +EXP, +atributo) — a decidir exatamente
  quais bônus por tipo de Posse.
- **Posses precisam ser guarnecidas**: a guilda deve manter tropas, unidades e
  heróis estacionados na Posse para retê-la. Uma Posse sem guarnição suficiente
  pode ser atacada e **capturada** por outra guilda — perder uma Posse é perder o
  bônus imediatamente para o atacante que a tomar.
- Isso cria um **custo de oportunidade real**: tropas/heróis alocados para
  guarnecer uma Posse não estão disponíveis para atacar ou defender a cidade do
  jogador — decisão estratégica de guilda, não individual.
- Ranking/prestígio de guilda deve refletir quantas Posses e de que tipo a guilda
  controla no momento (visibilidade pública no mapa e/ou em um placar de
  servidor).

> Decisão em aberto: dentro do mês, existe uma janela de tempo limitada de disputa
> (ex.: "Posse fica em disputa por 2h no primeiro fim de semana do mês, depois
> trava pro vencedor") ou é captura livre a qualquer momento uma vez enfraquecida
> a guarnição, durante todo o mês? Precisa da memória do autor para afinar
> (seção 13).

## 7. Progressão: Jogador e Heróis

Importante distinção confirmada pelo autor: **nível de jogador (conta)** e
**nível de herói** são duas coisas separadas. O que segue organiza as duas
trilhas e a hierarquia de heróis.

### 7.1 Nível do jogador (conta)

- **Nível máximo: Lv 80** (decisão de design para esta reconstrução — o jogo
  original ia até **Lv 54**, e esse cap era do **jogador**, não do herói).
  Ampliar o teto dá mais espaço de progressão e mais faixas de conteúdo ao longo
  do jogo; a tabela de EXP por nível deve ser desenhada do zero para essa nova
  faixa, não simplesmente esticada.
- Esse nível representa a progressão geral da conta (provavelmente ligado a
  quests, construção e conquistas), distinto da evolução de cada herói
  individual.

### 7.2 Hierarquia de rank dos heróis

Os heróis têm sua própria escada de rank/título, confirmada pelo autor — e ela é
visual, não só numérica: o rank determina a cor/material do equipamento do
herói, funcionando como uma escada de raridade clássica de MMO (comum → lendário):

| Rank | Material/cor do equipamento |
|---|---|
| Conde | Tudo simples, de pano |
| Visconde | Pano e couro |
| Visconde Superior | Armas e armaduras esverdeadas |
| Marquês | Armas e armaduras em tons azuis |
| Duque | Armas e armaduras roxas |
| **Deus** | Armas e armaduras douradas — **raríssimo** |

O rank **Deus** é a confirmação de que a mitologia grega existia de fato no jogo
original (seção 2): heróis desse rank eram literalmente deuses gregos (ex.:
Atena, Poseidon, Apolo, Hermes — o autor não lembra quantos ao todo). São os
heróis mais raros do jogo.

### 7.3 Aquisição de heróis — Cartas de Herói

Todo herói (de qualquer rank, incluindo Deus) é obtido por sorte através de
**Cartas de Herói**, que podem ser:

- **compradas no mercado** (entre jogadores ou na loja do sistema — seção 4.1), ou
- **ganhas como recompensa de missão**.

Isso torna a coleção de heróis um sistema de sorte/colecionismo (estilo
"gacha") paralelo à progressão de conta — quanto mais alto o rank em jogo (ou
mais rara a carta), menor a chance de tirá-lo. Jogadores podem acumular mais de
um herói.

### 7.4 Evolução e equipamento do herói

- Cada herói tem **status próprios e vai melhorando com o tempo** (confirmado
  pelo autor) — nível/experiência e atributos individuais por herói, além do
  rank fixo de raridade da seção 7.2.
- **Atributos**: Vida, Ataque, Defesa, Agilidade, Inteligência, Sorte — com
  pontos alocáveis manualmente a cada level up (confirmado por gameplay).
- **Experiência**: barra de EXP com teto por nível (ex. 0/500 nos níveis
  iniciais, visto em gameplay), subida por quests, batalhas, Posses e itens
  consumíveis ("Pergaminho de EXP de Herói").
- **Lealdade**: stat secundário visto na UI original — proposta: afeta
  eficácia de comando de tropas ou custo de manutenção (a definir).
- **Equipamento**: 7 slots — **Joia, Arma, Luva, Capa, Chapéu, Armadura, Calça**.
  Itens forjáveis na cidade (prédio Forja), obtidos via quest/loot, ou
  comprados no mercado entre jogadores (seção 4.1).

Heróis participam de: **Batalha** (ataque/defesa de território, incluindo
guarnição de Posses) e têm um botão dedicado de **Defender** — podem ser
destacados para reforçar uma cidade ou uma Posse sem sair em campanha ofensiva.

> Decisão em aberto: um herói pode subir de rank (Conde → Deus) por jogo, ou o
> rank é fixo desde a Carta de Herói que o originou, e só se troca de herói para
> ter um rank melhor? Precisa da memória do autor (seção 13).

## 8. Exército e Combate

- Tropas específicas por facção (a projetar em balanceamento — original tinha
  diferenciação visual e "estilo de combate" por facção, não detalhado em stats).
- Treino de tropas consome recursos + tempo, enfileirado no menu **Exército**.
- **Defesa**: menu dedicado separado de Exército — sugere tropas/estruturas
  puramente defensivas distintas das ofensivas (torres, muralhas, guarnição).
- Alvos de combate agora são explicitamente em camadas: **cidade de jogador**
  (saque de recursos), **castelo de NPC** (loot/treino), **mina no mapa**
  (disputa de produção) e **Posse de guilda** (disputa de bônus territorial,
  seção 6) — cada um com regras de recompensa/risco próprias a balancear.
- Relatórios de batalha via sistema de mensagens (`[Relatório] Mestre: ...` no
  chat/log, no jogo original usado também para completude de quest/construção —
  reconstruir como um **log de eventos unificado**, não só combate).

## 9. Guildas

Sistema modelado explicitamente no estilo Tribal Wars, por indicação direta do
autor:

- **Hierarquia interna com permissões por rank** (ex.: líder, oficial, membro) —
  quem pode convidar/expulsar, declarar diplomacia, gerenciar Posses, etc.
- **Diplomacia formal entre guildas**: aliado, neutro/NAP (pacto de não-agressão),
  inimigo — visível publicamente, afeta regras de ataque (ex.: aliados não podem
  ser atacados sem quebrar o pacto).
- **Página pública de guilda**: descrição, membros, ranking, Posses controladas.
- **Chat/fórum privado de guilda**, separado do chat geral (já confirmado na
  seção de UI — aba "Guilda" no chat).
- **Ranking de guilda** combinando pontuação de membros, Posses controladas e,
  possivelmente, um placar de poder ofensivo/defensivo agregado (equivalente ao
  ODA/ODD do Tribal Wars) — permite avaliar a força de uma guilda antes de uma
  guerra declarada.
- Guerra entre guildas deve ser **declarável formalmente**, distinta de PvP
  aleatório entre jogadores sem vínculo de guilda.

## 10. Progressão social (onboarding e comunicação)

- **Chat**: abas **Todos, Mundo, Guilda, Sistema** — manter essa separação; é o
  que sustenta a sensação de "mundo vivo" mesmo em um jogo majoritariamente
  assíncrono.
- **Quest / NPC tutor**: um "Mestre" guia o novo jogador via painel de quests com
  abas **Desenvolvimento, Diário, Herói, Guerra, Q&A** — reconstruir como onboarding
  guiado obrigatório nos primeiros 15–20 minutos.
- **Múltiplos servidores/mundos**: original operava com nomes de servidor próprios
  (ex. "Imperor 1/2/3"). Reconstrução deve tratar servidor como *mundo persistente
  isolado* com seu próprio mapa, mercado, ranking e fim de temporada (evita
  esvaziamento tardio de um único mundo, problema mencionado por ex-jogadores).

## 11. Economia e monetização (revisão deliberada)

- **Preço livre no mercado entre jogadores é uma feature, não um bug.** O jogo
  original não permitia presentear itens diretamente entre contas, e jogadores
  contornavam isso listando um item por um preço simbólico (ex. 2 de ouro) para
  um amigo comprar. O autor pediu explicitamente para **preservar** esse
  comportamento — é nostálgico e faz parte da identidade social do jogo. A
  reconstrução não deve impor piso de preço "anti-abuso" no mercado; se o
  design decidir permitir presente direto no futuro, deve ser uma adição, não
  uma substituição dessa válvula social já validada pelos jogadores.
- **Login-reward shop pago em moeda do jogo com escala agressiva** (visto em
  gameplay: recompensa por tempo logado, custando de 2.000 a 15.000 de moeda) —
  confirmado como um ponto real de fricção do original (o autor concorda). →
  manter o conceito de recompensa por tempo logado, mas sem fricção de compra —
  é engajamento, não cash shop.
- **Cartas de Herói** (seção 7.3) compradas com dinheiro real são o principal
  risco de pay-to-win desta reconstrução, já que determinam acesso a heróis de
  rank raro (Deus). Proposta: Cartas de Herói compráveis com dinheiro real
  concedem apenas as mesmas chances/ranks disponíveis via mercado ou missão —
  nunca uma carta exclusiva de dinheiro real com chance maior ou rank
  garantido.

Monetização proposta para a reconstrução (dinheiro real): cosméticos de
herói/cidade, slots de fila de construção extras, conveniências de UI. Nunca
stats, nunca exclusividade de unidade vencedora de batalha, nunca vantagem em
Posses ou no mercado entre jogadores.

## 12. Stack técnica proposta

Este é um jogo de mundo persistente com simulação server-side (produção contínua,
combate assíncrono, PvP, mapa compartilhado, mercado entre jogadores) — diferente
do padrão CRUD dos outros projetos do autor. Proposta inicial, a validar:

| Camada | Escolha proposta | Observação |
|---|---|---|
| Cliente web | Next.js (App Router) + TypeScript | Consistente com o resto do stack do autor |
| Simulação de mundo | Serviço dedicado (Node/TypeScript) com tick determinístico | Produção de recursos, filas de construção/treino, resolução de combate e disputa de Posses rodam no servidor, não no cliente |
| Mapa | Renderização client-side (canvas/WebGL) consultando um serviço de mapa que indexa tiles (cidades, castelos NPC, minas, Posses) | Volume de tiles pode exigir paginação/streaming por viewport, não carregar o mapa inteiro |
| Tempo real | WebSocket (chat, notificações, atualização de fila, disputas de Posse ao vivo) | Polling apenas como fallback |
| Dados | Postgres (Neon) para estado persistente; considerar cache em memória para o tick ativo e para o estado do mapa | Volume de escrita por tick pode exigir tuning fora do padrão CRUD |
| Deploy | Vercel para o cliente; avaliar host separado para o serviço de simulação (long-running, não serverless) | Vercel Functions não é ideal para um loop de tick contínuo |

> Este é o ponto de maior incerteza técnica do projeto — merece uma sessão de
> arquitetura própria antes de codar o MVP (seção 14).

## 13. Decisões em aberto (precisam de input do autor)

- [ ] Além do rank Deus (heróis = deuses gregos, seção 7.2), existia também um
      sistema separado de "jurar fidelidade a uma divindade do Olimpo" (fonte
      secundária de pesquisa), ou é a mesma coisa descrita por quem não jogou?
- [ ] Um herói pode subir de rank (Conde → Deus) jogando, ou o rank vem fixo da
      Carta de Herói e só se troca de herói para melhorar? (seção 7.4)
- [ ] Quantos e quais deuses gregos existiam como heróis Deus, além de Atena,
      Poseidon, Apolo e Hermes?
- [ ] Nomes e stats de unidades por facção: **não é mais reconstrução** — o autor
      não lembra os originais, então serão **criados do zero** como design
      próprio (não precisa de mais pesquisa aqui).
- [ ] Posses: confirmado como evento mensal (seção 6) — falta definir a duração
      exata da janela de disputa dentro do mês e o critério de desempate.
- [ ] PvE: dúvida ainda não resolvida com o autor — a pergunta é se, **além** de
      atacar castelos de NPC no mapa (seção 5) e cumprir quests de progressão, o
      jogo original tinha conteúdo PvE dedicado e instanciado (ex.: uma masmorra
      explorável sozinho ou em grupo, com chefes) — ou se castelos de NPC e
      quests já eram "todo o PvE" que existia.
- [ ] Nome final do projeto — confirmado que será substituído por um nome
      próprio mais adiante (repositório usa "Rei e Conquistador" apenas como
      referência de pesquisa, para evitar ambiguidade de marca com o jogo
      original/UOL).

## 14. Próximos passos

1. Sessão de arquitetura dedicada para o serviço de simulação de mundo e do mapa
   compartilhado (seção 12).
2. Wireframes de baixa fidelidade das telas principais (Cidade, Mapa, Posses,
   Mercado, Herói, Exército, Tecnologia, Defesa, Guilda) baseados nos layouts
   reconstruídos aqui.
3. Definir stats/números da primeira versão jogável (uma facção só, um servidor
   só, sem guilda, sem Posses) — MVP mínimo para validar o loop de construção +
   combate + mercado antes de expandir para 3 facções, Posses e guerra de
   guildas completa.

## Fontes da reconstrução

- Memória direta do autor, que jogou o jogo original (fonte principal para
  economia entre jogadores, mapa, Posses, guildas e nível máximo).
- Blog "Ultra Games 2000" (2010) e site Zigg (descrição geral, 3 facções).
- Comentários de ex-jogadores (nomes de servidor, guildas, bugs de economia).
- Vídeo de gameplay "Rei e conquistador" (canal PanicoBL, publicado em
  14/02/2012) — fonte primária para telas de criação de personagem, tutorial,
  quests, ficha de herói, tooltips de construção e shop de login.
- Nenhuma fonte oficial de design (GDD original, wiki oficial) foi localizada;
  o jogo é hoje, em grande parte, mídia perdida.
