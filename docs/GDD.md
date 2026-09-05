# Rei e Conquistador — Game Design Document (v0.1)

> Documento de reconstrução. **Rei e Conquistador** original foi um browser MMO de
> estratégia hospedado em `br.337.com` (portal 337 Technology Limited / UOL Jogos),
> lançado por volta de 2010 e encerrado em algum momento entre 2012 e a atualidade —
> sem sucessor oficial. Este documento reconstrói os sistemas do jogo a partir de
> pesquisa (páginas arquivadas, comentários de comunidade, um vídeo de gameplay de
> 2012) como ponto de partida para um **remake/homenagem moderno**, não como cópia
> de assets ou código originais. Nome, arte e strings específicas do jogo original
> não são reaproveitados — apenas os sistemas e a sensação de jogo.

## 1. Pitch

Um MMO de estratégia em navegador onde o jogador governa uma cidade, desenvolve um
herói e disputa território contra outros jogadores em um mundo persistente
compartilhado — a base de "construção + PvP assíncrono" de jogos como Tribal Wars,
somada a uma camada de progressão de herói/RPG e uma escolha de facção com
identidade própria.

**Pilares de design:**
1. **Cidade viva** — toda decisão de construção tem custo/tempo real e compete com
   outras prioridades (economia vs. exército vs. tecnologia).
2. **Herói como personagem, não como stat** — o herói progride, equipa itens e tem
   identidade visual, ao contrário de jogos puramente numéricos.
3. **Facção com peso narrativo** — a escolha entre as três facções afeta estética,
   unidades e (futuramente) narrativa de servidor, não é só reskin.
4. **PvP assíncrono e social** — combate e diplomacia acontecem mesmo com o jogador
   offline; guildas e chat são centrais, não acessórios.
5. **Sem pay-to-win** — monetização cosmética/conveniência apenas (ver seção 9).

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
> confirmado** — decisão de design em aberto (seção 11).

## 3. Loop principal

```
Coletar recursos (passivo, por hora)
        │
        ▼
Construir / evoluir prédios ──► Desbloquear unidades e tecnologias
        │                              │
        ▼                              ▼
Treinar exército                 Equipar e evoluir herói
        │                              │
        └──────────────┬───────────────┘
                        ▼
        Cumprir quests / atacar ou defender território
                        │
                        ▼
        Ganhar pontuação, recursos, itens, guilda cresce
                        │
                        └──► volta ao topo (loop de médio prazo: horas/dias)
```

Sessões curtas (checar produção, coletar quest, reforçar defesa) e sessões longas
(planejar ataque, evoluir tech tree) devem ser ambas viáveis — jogo assíncrono por
natureza (produção continua offline).

## 4. Recursos

Quatro recursos base, cada um com prédio de produção dedicado (produção em
unidades/hora, visível na UI principal):

| Recurso | Prédio produtor | Uso principal |
|---|---|---|
| Madeira | Moinho de Madeira | Construção, unidades básicas |
| Pedra | Pedreira | Construção, defesas |
| Ferro | Mina de Ferro | Unidades avançadas, equipamentos |
| Ouro | Tesouraria / comércio | Upgrades caros, contratação de mercenários, cash shop |

Cada prédio de recurso tem: nível atual, produção/hora atual, e custo (nos 4
recursos + tempo) para o próximo nível — visto diretamente em tooltip no jogo
original.

## 5. Construção da cidade

Menu principal fixo na UI (confirmado por gameplay): **Construção · Tecnologia ·
Herói · Exército · Defesa**, cada um abrindo um painel dedicado. Toda ação de fila
(construir, treinar, pesquisar) mostra um timer regressivo ao lado do respectivo
menu.

Prédios confirmados/deduzidos para a v0.1 da reconstrução:

- **Moinho de Madeira**, **Pedreira**, **Mina de Ferro**, **Tesouraria** — produção.
- **Quartel / Caserna** — treino de tropas básicas.
- **Templo** — bênçãos ou unidades especiais de facção.
- **Forja** — criação/aprimoramento de equipamento de herói.
- **Muralha / torres** — defesa passiva do território.
- **Prédio de Guilda ("Grêmio")** — benefícios coletivos, visível na UI principal.

Cada prédio: nível, fila de upgrade única por cidade (decisão de design — ou fila
múltipla paga com ouro, ver seção 9), custo crescente por nível.

## 6. Sistema de Herói

Cada personagem tem **um herói principal** com:

- **Atributos**: Vida, Ataque, Defesa, Agilidade, Inteligência, Sorte — com pontos
  de atributo alocáveis manualmente a cada level up (confirmado por gameplay).
- **Experiência**: barra de EXP com teto por nível (ex. 0/500), subida por quests,
  batalhas e itens consumíveis ("Pergaminho de EXP de Herói").
- **Lealdade**: stat secundário visto na UI original — proposta: afeta
  eficácia de comando de tropas ou custo de manutenção (a definir).
- **Equipamento**: 7 slots — **Joia, Arma, Luva, Capa, Chapéu, Armadura, Calça**.
  Itens forjáveis na cidade (prédio Forja) ou obtidos via quest/loot.
- **Título**: título textual que evolui com progressão (ex. "Visconde Superior"
  visto em gameplay) — sistema de rank narrativo independente do nível numérico.

Herói participa de: **Batalha** (ataque/defesa de território) e tem um botão
dedicado de **Defender** — sugerindo que o herói pode ser destacado para reforçar
uma cidade sem sair em campanha.

## 7. Exército e Combate

- Tropas específicas por facção (a projetar em balanceamento — original tinha
  diferenciação visual e "estilo de combate" por facção, não detalhado em stats).
- Treino de tropas consome recursos + tempo, enfileirado no menu **Exército**.
- **Defesa**: menu dedicado separado de Exército — sugere tropas/estruturas
  puramente defensivas distintas das ofensivas (torres, muralhas, guarnição).
- Conquista de território: unidades saqueiam recursos de jogadores derrotados
  (confirmado por pesquisa textual) — reforça o loop de PvP como fonte de economia,
  não só destruição.
- Relatórios de batalha via sistema de mensagens (`[Relatório] Mestre: ...` no
  chat/log, no jogo original usado também para completude de quest/construção —
  reconstruir como um **log de eventos unificado**, não só combate).

## 8. Progressão social

- **Grêmio (Guilda)**: entidade central, com aba própria no chat e no menu
  principal. Proposta de escopo: guildas têm nome, nível/prédio, chat privado,
  bônus coletivo, e (fase futura) território de guilda.
- **Chat**: abas **Todos, Mundo, Guilda, Sistema** — manter essa separação; é o
  que sustenta a sensação de "mundo vivo" mesmo em um jogo majoritariamente
  assíncrono.
- **Quest / NPC tutor**: um "Mestre" guia o novo jogador via painel de quests com
  abas **Desenvolvimento, Diário, Herói, Guerra, Q&A** — reconstruir como onboarding
  guiado obrigatório nos primeiros 15–20 minutos (mapeia yields conhecidos de
  retenção em jogos deste gênero).
- **Múltiplos servidores/mundos**: original operava com nomes de servidor próprios
  (ex. "Imperor 1/2/3"). Reconstrução deve tratar servidor como *mundo persistente
  isolado* com seu próprio ranking e fim de temporada (evita esvaziamento tardio de
  um único mundo, problema mencionado por ex-jogadores).

## 9. Economia e monetização (revisão deliberada)

O jogo original teve dois problemas relatados pela comunidade que este redesign
evita deliberadamente:
1. **Itens de poder vendidos baratos por bug/GM inativo** → minar a confiança dos
   jogadores de longo prazo. → *Todo item com efeito em stats deve ser obtenível
   por jogo, nunca exclusivo de compra; compras aceleram, não substituem.*
2. **Login-reward shop pago em moeda do jogo com escala agressiva** (visto em
   gameplay: recompensa por tempo logado, custando de 2.000 a 15.000 de moeda) →
   manter o conceito de recompensa por tempo logado, mas sem fricção de compra —
   é engajamento, não cash shop.

Monetização proposta para a reconstrução: cosméticos de herói/cidade, slots de fila
de construção extras, conveniências de UI. Nunca stats, nunca exclusividade de
unidade vencedora de batalha.

## 10. Stack técnica proposta

Este é um jogo de mundo persistente com simulação server-side (produção contínua,
combate assíncrono, PvP) — diferente do padrão CRUD dos outros projetos do autor.
Proposta inicial, a validar:

| Camada | Escolha proposta | Observação |
|---|---|---|
| Cliente web | Next.js (App Router) + TypeScript | Consistente com o resto do stack do autor |
| Simulação de mundo | Serviço dedicado (Node/TypeScript) com tick determinístico | Produção de recursos, filas de construção/treino e resolução de combate rodam no servidor, não no cliente |
| Tempo real | WebSocket (chat, notificações, atualização de fila) | Polling apenas como fallback |
| Dados | Postgres (Neon) para estado persistente; considerar cache em memória para o tick ativo | Volume de escrita por tick pode exigir tuning fora do padrão CRUD |
| Deploy | Vercel para o cliente; avaliar host separado para o serviço de simulação (long-running, não serverless) | Vercel Functions não é ideal para um loop de tick contínuo |

> Este é o ponto de maior incerteza técnica do projeto — merece uma sessão de
> arquitetura própria antes de codar o MVP (ver seção 12).

## 11. Decisões em aberto (precisam de input do autor)

- [ ] Sistema de mitologia grega/bênçãos divinas existia de fato ou é ruído de
      pesquisa? Incluir ou descartar.
- [ ] Nomes e stats exatos das unidades por facção (original não documentado em
      detalhe suficiente — precisa de design original).
- [ ] Escopo de PvE (masmorras, NPCs) vs. o jogo original, que parecia ser
      majoritariamente PvP + quests de progressão.
- [ ] Se guildas terão território próprio no mapa (feature comum no gênero, não
      confirmada no original).
- [ ] Nome final do projeto (repositório usa "Rei e Conquistador" apenas como
      referência de pesquisa — decidir marca própria antes de lançar publicamente,
      para evitar qualquer ambiguidade de marca com o jogo original/UOL).

## 12. Próximos passos

1. Sessão de arquitetura dedicada para o serviço de simulação de mundo (seção 10).
2. Wireframes de baixa fidelidade das 5 telas principais (Cidade, Herói, Exército,
   Tecnologia, Defesa) baseados nos layouts reconstruídos aqui.
3. Definir stats/números da primeira versão jogável (uma facção só, um servidor só,
   sem guilda) — MVP mínimo para validar o loop de construção + combate antes de
   expandir para 3 facções e sistema social completo.

## Fontes da reconstrução

- Blog "Ultra Games 2000" (2010) e site Zigg (descrição geral, 3 facções).
- Comentários de ex-jogadores (nomes de servidor, guildas, bugs de economia).
- Vídeo de gameplay "Rei e conquistador" (canal PanicoBL, publicado em
  14/02/2012) — fonte primária para telas de criação de personagem, tutorial,
  quests, ficha de herói, tooltips de construção e shop de login.
- Nenhuma fonte oficial de design (GDD original, wiki oficial) foi localizada;
  o jogo é hoje, em grande parte, mídia perdida.
