# Rei e Conquistador — Game Design Document (v0.2)

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

> Nota de pesquisa: o material original também continha referências soltas à
> mitologia grega (menção a "Zeus" em chat, "divindade do Olimpo" em uma fonte
> secundária). Não ficou claro se isso era um sistema paralelo (ex.: bênçãos
> divinas) ou contaminação de outro jogo do mesmo portal. Tratar como **não
> confirmado** — decisão de design em aberto (seção 12).

## 3. Loop principal

```
Coletar recursos (passivo, por hora, na própria cidade)
        │
        ▼
Construir / evoluir prédios ──► Desbloquear unidades e tecnologias
        │                              │
        ▼                              ▼
Treinar exército                 Equipar e evoluir herói (até Lv 80)
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
individual. Proposta de sistema:

- **Mercado/Comércio**: painel dedicado onde jogadores publicam ofertas de troca
  (ex.: "dou 5.000 Madeira, quero 3.000 Ferro") ou vendem por Ouro — um livro de
  ofertas visível a todo o servidor (ou à região do mapa, a decidir).
- **Caravanas**: envio físico de recursos entre cidades tem tempo de viagem e é
  **interceptável** por outro jogador no mapa (arriscar o comércio é parte do
  jogo) — coerente com o fato de o mapa ser uma entidade viva (seção 5).
- Excedente de produção (ex.: uma cidade especializada em Ferro) só tem valor se
  puder ser escoado — o mercado é o que torna a especialização de cidade uma
  escolha real, em vez de todo mundo construir os mesmos 4 prédios na mesma
  proporção.
- **Decisão em aberto**: existia leilão/mercado global automático (tipo auction
  house) no original, ou era só troca direta jogador-a-jogador? A memória do autor
  deve resolver isso (seção 12).

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

- Periodicamente (gatilho exato a definir — pode ser por horário fixo, por evento
  de servidor, ou por idade do servidor), **áreas específicas do mapa "abrem"
  para disputa** entre guildas.
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

> Decisão em aberto: frequência exata de abertura das Posses, se existe uma janela
> de tempo limitada de disputa (ex.: "Posse fica em disputa por 2h, depois trava
> pro vencedor") ou se é captura livre a qualquer momento uma vez enfraquecida a
> guarnição. Precisa da memória do autor para afinar (seção 12).

## 7. Sistema de Herói

Cada personagem tem **um herói principal** com:

- **Nível máximo: Lv 80** (decisão de design para esta reconstrução — o jogo
  original ia até **Lv 54**). Ampliar o teto dá mais espaço de progressão e mais
  faixas de conteúdo/equipamento ao longo do jogo; a tabela de EXP por nível e a
  curva de atributos devem ser desenhadas do zero para essa nova faixa, não
  simplesmente esticadas.
- **Atributos**: Vida, Ataque, Defesa, Agilidade, Inteligência, Sorte — com pontos
  de atributo alocáveis manualmente a cada level up (confirmado por gameplay).
- **Experiência**: barra de EXP com teto por nível (ex. 0/500 nos níveis iniciais,
  visto em gameplay), subida por quests, batalhas, Posses e itens consumíveis
  ("Pergaminho de EXP de Herói").
- **Lealdade**: stat secundário visto na UI original — proposta: afeta
  eficácia de comando de tropas ou custo de manutenção (a definir).
- **Equipamento**: 7 slots — **Joia, Arma, Luva, Capa, Chapéu, Armadura, Calça**.
  Itens forjáveis na cidade (prédio Forja), obtidos via quest/loot, **ou
  comprados no mercado entre jogadores** (seção 4.1).
- **Título**: título textual que evolui com progressão (ex. "Visconde Superior"
  visto em gameplay) — sistema de rank narrativo independente do nível numérico.

Herói participa de: **Batalha** (ataque/defesa de território, incluindo
guarnição de Posses) e tem um botão dedicado de **Defender** — o herói pode ser
destacado para reforçar uma cidade ou uma Posse sem sair em campanha ofensiva.

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

O jogo original teve dois problemas relatados pela comunidade que este redesign
evita deliberadamente:
1. **Itens de poder vendidos baratos por bug/GM inativo** → minar a confiança dos
   jogadores de longo prazo. → *Todo item com efeito em stats deve ser obtenível
   por jogo (incluindo via mercado entre jogadores, seção 4.1), nunca exclusivo de
   compra com dinheiro real; compras aceleram, não substituem.*
2. **Login-reward shop pago em moeda do jogo com escala agressiva** (visto em
   gameplay: recompensa por tempo logado, custando de 2.000 a 15.000 de moeda) →
   manter o conceito de recompensa por tempo logado, mas sem fricção de compra —
   é engajamento, não cash shop.

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

- [ ] Sistema de mitologia grega/bênçãos divinas existia de fato ou é ruído de
      pesquisa? Incluir ou descartar.
- [ ] Nomes e stats exatos das unidades por facção (original não documentado em
      detalhe suficiente — precisa de design original).
- [ ] Mercado: era troca direta jogador-a-jogador, leilão automático, ou os dois?
- [ ] Posses: gatilho exato de abertura (horário fixo? evento de servidor?) e se
      existe janela de tempo limitada de disputa.
- [ ] Escopo de PvE além de castelos de NPC (masmorras, chefes) vs. o jogo
      original.
- [ ] Nome final do projeto (repositório usa "Rei e Conquistador" apenas como
      referência de pesquisa — decidir marca própria antes de lançar publicamente,
      para evitar qualquer ambiguidade de marca com o jogo original/UOL).

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
