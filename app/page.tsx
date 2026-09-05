"use client";

import { useEffect, useMemo, useState } from "react";

type ResourceKey = "madeira" | "pedra" | "ferro" | "ouro";

const RESOURCE_LABEL: Record<ResourceKey, string> = {
  madeira: "Madeira",
  pedra: "Pedra",
  ferro: "Ferro",
  ouro: "Ouro",
};

const RESOURCE_COLOR: Record<ResourceKey, string> = {
  madeira: "#8a6a45",
  pedra: "#8b93a3",
  ferro: "#b3714a",
  ouro: "#d6a94e",
};

type Cost = Partial<Record<ResourceKey, number>>;

type Building = {
  id: string;
  name: string;
  resource?: ResourceKey;
  baseRate?: number; // per hour at level 1
  x: number; // %
  y: number; // %
  baseCost: Cost;
  buildSec: number;
};

const BUILDINGS: Building[] = [
  { id: "moinho", name: "Moinho de Madeira", resource: "madeira", baseRate: 220, x: 14, y: 62, baseCost: { madeira: 80, pedra: 40 }, buildSec: 8 },
  { id: "pedreira", name: "Pedreira", resource: "pedra", baseRate: 160, x: 24, y: 78, baseCost: { madeira: 60, pedra: 60 }, buildSec: 10 },
  { id: "mina", name: "Mina de Ferro", resource: "ferro", baseRate: 90, x: 78, y: 70, baseCost: { madeira: 50, ferro: 40, pedra: 30 }, buildSec: 12 },
  { id: "tesouraria", name: "Tesouraria", resource: "ouro", baseRate: 35, x: 88, y: 52, baseCost: { pedra: 90, ferro: 30 }, buildSec: 14 },
  { id: "quartel", name: "Quartel", x: 40, y: 82, baseCost: { madeira: 120, ferro: 60 }, buildSec: 18 },
  { id: "forja", name: "Forja", x: 66, y: 46, baseCost: { pedra: 70, ferro: 90 }, buildSec: 20 },
  { id: "templo", name: "Templo", x: 50, y: 30, baseCost: { pedra: 150, ouro: 20 }, buildSec: 24 },
  { id: "muralha", name: "Muralha", x: 10, y: 40, baseCost: { pedra: 200 }, buildSec: 22 },
];

function upgradeCost(b: Building, nextLevel: number): Cost {
  const mult = Math.pow(1.55, nextLevel - 1);
  const out: Cost = {};
  for (const k of Object.keys(b.baseCost) as ResourceKey[]) {
    out[k] = Math.round((b.baseCost[k] ?? 0) * mult);
  }
  return out;
}

function affordable(cost: Cost, res: Record<ResourceKey, number>) {
  return (Object.keys(cost) as ResourceKey[]).every((k) => res[k] >= (cost[k] ?? 0));
}

type Rank = "Conde" | "Visconde" | "Visconde Superior" | "Marquês" | "Duque" | "Deus";

const RANK_COLOR: Record<Rank, string> = {
  Conde: "#9a9aa2",
  Visconde: "#b08a5a",
  "Visconde Superior": "#5fae72",
  Marquês: "#5b93c9",
  Duque: "#a570cf",
  Deus: "#d6a94e",
};

const EQUIP_SLOTS = ["Joia", "Arma", "Luva", "Capa", "Chapéu", "Armadura", "Calça"] as const;

const CHAT_TABS = ["Todos", "Mundo", "Guilda", "Sistema"] as const;
type ChatTab = (typeof CHAT_TABS)[number];

const CHAT_LOG: Record<ChatTab, string[]> = {
  Todos: [
    "[Guilda] NitroVerde: bora disputar a Posse do Vale Cinza esse mês?",
    "[Mundo] xXConquistadorXx atacou o castelo de Lyandra!",
    "[Sistema] Sua Mina de Ferro atingiu o nível 2.",
    "[Todos] Seja bem-vindo(a) ao servidor, aventureiro.",
  ],
  Mundo: [
    "[Mundo] xXConquistadorXx atacou o castelo de Lyandra!",
    "[Mundo] Guilda Al-Qaeda dominou 3 minas de Ferro na região norte.",
    "[Mundo] Um herói Duque foi avistado guarnecendo a Posse do Rio Negro.",
  ],
  Guilda: [
    "[Guilda] NitroVerde: bora disputar a Posse do Vale Cinza esse mês?",
    "[Guilda] Liderança: guarnição da Posse renovada, obrigado a quem ajudou.",
    "[Guilda] novo_membro_22 entrou na guilda.",
  ],
  Sistema: [
    "[Sistema] Sua Mina de Ferro atingiu o nível 2.",
    "[Sistema] Quest concluída: Iniciação de Madeireiro. Recompensa coletada.",
    "[Sistema] Uma Carta de Herói rara foi encontrada no mercado.",
  ],
};

const TOP_PANELS = {
  mapa: {
    title: "Mapa do Mundo",
    body: "Grade compartilhada por todo o servidor: castelos de NPC, minas neutras (qualquer um pode dominar, ninguém é dono de verdade) e as Posses de guilda. Em construção — a próxima peça a prototipar.",
  },
  quest: {
    title: "Quest",
    body: '"Iniciação de Madeireiro" — evolua o Moinho de Madeira para o nível 2. Recompensa: 120 de Ouro + 1 Carta de Herói (Conde).',
  },
  guilda: {
    title: "Grêmio",
    body: "Você ainda não está em uma guilda. Guildas têm hierarquia por rank, diplomacia (aliado / NAP / inimigo) e guarnecem Posses em conjunto — ver GDD seção 9.",
  },
  posses: {
    title: "Posses",
    body: "Nenhuma disputa aberta agora — Posses abrem para disputa mensalmente. Quando abertas, guildas guarnecem a área com tropas e heróis para reter o bônus territorial.",
  },
  mercado: {
    title: "Mercado",
    body: "Sistema misto: a Tesouraria do reino oferece recursos para seedar a economia, e jogadores comercializam entre si. Preço livre — inclusive quase de graça, se você quiser presentear um amigo.",
  },
} as const;
type TopPanelKey = keyof typeof TOP_PANELS;

const BOTTOM_TABS = ["Construção", "Tecnologia", "Herói", "Exército", "Defesa"] as const;
type BottomTab = (typeof BOTTOM_TABS)[number];

export default function Home() {
  const [resources, setResources] = useState<Record<ResourceKey, number>>({
    madeira: 1961,
    pedra: 1200,
    ferro: 640,
    ouro: 480,
  });
  const [levels, setLevels] = useState<Record<string, number>>(
    Object.fromEntries(BUILDINGS.map((b) => [b.id, 1]))
  );
  const [building, setBuilding] = useState<Record<string, number | null>>(
    Object.fromEntries(BUILDINGS.map((b) => [b.id, null]))
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [bottomTab, setBottomTab] = useState<BottomTab | null>(null);
  const [topPanel, setTopPanel] = useState<TopPanelKey | null>(null);
  const [chatTab, setChatTab] = useState<ChatTab>("Todos");
  const [now, setNow] = useState(() => new Date("2026-09-04T09:00:00"));
  const [heroPoints, setHeroPoints] = useState(3);
  const [heroAttrs, setHeroAttrs] = useState({
    vida: 48,
    ataque: 22,
    defesa: 19,
    agilidade: 14,
    inteligencia: 11,
    sorte: 9,
  });

  const perHour = useMemo(() => {
    const out: Record<ResourceKey, number> = { madeira: 0, pedra: 0, ferro: 0, ouro: 0 };
    for (const b of BUILDINGS) {
      if (!b.resource || !b.baseRate) continue;
      out[b.resource] += Math.round(b.baseRate * Math.pow(1.28, levels[b.id] - 1));
    }
    return out;
  }, [levels]);

  // tick resources + server clock
  useEffect(() => {
    const id = setInterval(() => {
      setResources((r) => {
        const next = { ...r };
        (Object.keys(next) as ResourceKey[]).forEach((k) => {
          next[k] = Math.round(next[k] + perHour[k] / 3600);
        });
        return next;
      });
      setNow((n) => new Date(n.getTime() + 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [perHour]);

  // resolve building queues
  useEffect(() => {
    const id = setInterval(() => {
      setBuilding((b) => {
        let changed = false;
        const next = { ...b };
        for (const key of Object.keys(next)) {
          const finishAt = next[key];
          if (finishAt !== null && Date.now() >= finishAt) {
            next[key] = null;
            changed = true;
            setLevels((lv) => ({ ...lv, [key]: lv[key] + 1 }));
          }
        }
        return changed ? next : b;
      });
    }, 500);
    return () => clearInterval(id);
  }, []);

  function startUpgrade(b: Building) {
    if (building[b.id] !== null) return;
    const nextLevel = levels[b.id] + 1;
    const cost = upgradeCost(b, nextLevel);
    if (!affordable(cost, resources)) return;
    setResources((r) => {
      const next = { ...r };
      (Object.keys(cost) as ResourceKey[]).forEach((k) => {
        next[k] -= cost[k] ?? 0;
      });
      return next;
    });
    setBuilding((bd) => ({ ...bd, [b.id]: Date.now() + b.buildSec * 1000 }));
  }

  const selectedBuilding = BUILDINGS.find((b) => b.id === selected) ?? null;

  return (
    <div className="flex h-screen flex-col overflow-hidden text-[var(--foreground)]">
      {/* HUD superior */}
      <header className="z-20 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--line)] bg-[var(--surface)] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[var(--surface-2)] font-display text-sm text-[var(--accent)]">
            RC
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm text-[var(--foreground)]">Phenix</p>
            <p className="text-[11px] text-[var(--ink-faint)]">Lv. 12 · Sem guilda</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-1">
          {(Object.keys(resources) as ResourceKey[]).map((k) => (
            <div key={k} className="flex items-center gap-1.5" title={RESOURCE_LABEL[k]}>
              <span
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ background: RESOURCE_COLOR[k] }}
              />
              <span className="tabular text-sm">{resources[k].toLocaleString("pt-BR")}</span>
              <span className="tabular text-[10px] text-[var(--good)]">
                +{perHour[k]}/h
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {(Object.keys(TOP_PANELS) as TopPanelKey[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setTopPanel(key);
                setSelected(null);
              }}
              className={`rounded-sm border px-2.5 py-1 text-xs capitalize transition-colors ${
                topPanel === key
                  ? "border-[var(--accent)] text-[var(--accent-strong)]"
                  : "border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
              }`}
            >
              {TOP_PANELS[key].title}
            </button>
          ))}
        </div>

        <div className="tabular text-[11px] text-[var(--ink-faint)]">
          Tempo de Servidor: {now.toLocaleString("pt-BR")}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat lateral */}
        <aside className="hidden w-64 flex-col border-r border-[var(--line)] bg-[var(--surface)] md:flex">
          <div className="flex border-b border-[var(--line)]">
            {CHAT_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setChatTab(t)}
                className={`flex-1 px-2 py-2 text-[11px] transition-colors ${
                  chatTab === t
                    ? "border-b-2 border-[var(--accent)] text-[var(--accent-strong)]"
                    : "text-[var(--ink-faint)] hover:text-[var(--ink-soft)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3 text-[11px] leading-relaxed text-[var(--ink-soft)]">
            {CHAT_LOG[chatTab].map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </aside>

        {/* Cena da cidade */}
        <main className="scene-sky relative flex-1 overflow-hidden">
          <div className="scene-ridge absolute inset-x-0 bottom-0 h-2/3 bg-[#2a3244]" />
          <div className="scene-ridge-2 absolute inset-x-0 bottom-0 h-1/2 bg-[#1c2130]" />

          {BUILDINGS.map((b) => {
            const isBuilding = building[b.id] !== null;
            const color = b.resource ? RESOURCE_COLOR[b.resource] : "var(--accent)";
            return (
              <button
                key={b.id}
                onClick={() => {
                  setSelected(b.id);
                  setTopPanel(null);
                }}
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              >
                <span
                  className={`hotspot-pulse block h-3.5 w-3.5 rounded-full border-2 ${
                    selected === b.id ? "border-white" : "border-black/30"
                  }`}
                  style={{ background: color }}
                />
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {b.name} · Lv {levels[b.id]}
                  {isBuilding ? " (construindo…)" : ""}
                </span>
              </button>
            );
          })}
        </main>

        {/* Painel lateral direito: detalhe de prédio ou painel do topo */}
        {(selectedBuilding || topPanel) && (
          <aside className="w-80 shrink-0 border-l border-[var(--line)] bg-[var(--surface)] p-4 overflow-y-auto">
            {selectedBuilding && (
              <BuildingPanel
                b={selectedBuilding}
                level={levels[selectedBuilding.id]}
                finishAt={building[selectedBuilding.id]}
                resources={resources}
                perHour={selectedBuilding.resource ? perHour[selectedBuilding.resource] : undefined}
                onUpgrade={() => startUpgrade(selectedBuilding)}
                onClose={() => setSelected(null)}
              />
            )}
            {!selectedBuilding && topPanel && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-base text-[var(--accent-strong)]">
                    {TOP_PANELS[topPanel].title}
                  </h2>
                  <button
                    onClick={() => setTopPanel(null)}
                    className="text-[var(--ink-faint)] hover:text-[var(--foreground)]"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                  {TOP_PANELS[topPanel].body}
                </p>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Painel inferior (aba ativa) */}
      {bottomTab && (
        <div className="max-h-64 overflow-y-auto border-t border-[var(--line)] bg-[var(--surface)] px-4 py-3">
          {bottomTab === "Herói" && (
            <HeroPanel
              points={heroPoints}
              attrs={heroAttrs}
              onAllocate={(k) => {
                if (heroPoints <= 0) return;
                setHeroPoints((p) => p - 1);
                setHeroAttrs((a) => ({ ...a, [k]: a[k] + 1 }));
              }}
            />
          )}
          {bottomTab === "Construção" && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {BUILDINGS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className="rounded-sm border border-[var(--line)] px-3 py-2 text-left text-xs hover:border-[var(--accent)]"
                >
                  <p className="text-[var(--foreground)]">{b.name}</p>
                  <p className="tabular text-[var(--ink-faint)]">Lv {levels[b.id]}</p>
                </button>
              ))}
            </div>
          )}
          {bottomTab === "Tecnologia" && (
            <p className="text-sm text-[var(--ink-faint)]">
              Árvore de tecnologia ainda não prototipada — próximo passo do MVP (GDD seção 14).
            </p>
          )}
          {bottomTab === "Exército" && (
            <p className="text-sm text-[var(--ink-faint)]">
              Treino de tropas por facção ainda não prototipado, incluindo o &quot;Rato&quot; —
              tropa dedicada a farmar Ruínas em busca de Fragmentos vendáveis no mercado (GDD 8.2).
            </p>
          )}
          {bottomTab === "Defesa" && (
            <p className="text-sm text-[var(--ink-faint)]">
              Muralhas, torres e guarnição ainda não prototipados.
            </p>
          )}
        </div>
      )}

      {/* Menu inferior fixo */}
      <nav className="flex border-t border-[var(--line)] bg-[var(--surface-2)]">
        {BOTTOM_TABS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setBottomTab((cur) => (cur === t ? null : t));
              setSelected(null);
              setTopPanel(null);
            }}
            className={`flex-1 py-2.5 text-xs font-medium tracking-wide transition-colors ${
              bottomTab === t
                ? "bg-[var(--accent-tint)] text-[var(--accent-strong)]"
                : "text-[var(--ink-soft)] hover:text-[var(--foreground)]"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>
    </div>
  );
}

function BuildingPanel({
  b,
  level,
  finishAt,
  resources,
  perHour,
  onUpgrade,
  onClose,
}: {
  b: Building;
  level: number;
  finishAt: number | null;
  resources: Record<ResourceKey, number>;
  perHour?: number;
  onUpgrade: () => void;
  onClose: () => void;
}) {
  const cost = upgradeCost(b, level + 1);
  const canAfford = affordable(cost, resources);
  const [, force] = useState(0);

  useEffect(() => {
    if (finishAt === null) return;
    const id = setInterval(() => force((n) => n + 1), 500);
    return () => clearInterval(id);
  }, [finishAt]);

  const remaining = finishAt ? Math.max(0, Math.ceil((finishAt - Date.now()) / 1000)) : 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base text-[var(--accent-strong)]">{b.name}</h2>
        <button onClick={onClose} className="text-[var(--ink-faint)] hover:text-[var(--foreground)]">
          ✕
        </button>
      </div>
      <p className="mb-1 text-xs text-[var(--ink-faint)]">Nível atual</p>
      <p className="tabular mb-3 text-lg">{level}</p>

      {perHour !== undefined && (
        <>
          <p className="mb-1 text-xs text-[var(--ink-faint)]">Produção</p>
          <p className="tabular mb-3 text-sm text-[var(--good)]">+{perHour}/h</p>
        </>
      )}

      <p className="mb-1 text-xs text-[var(--ink-faint)]">Custo para nível {level + 1}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(cost) as ResourceKey[]).map((k) => (
          <span
            key={k}
            className="tabular flex items-center gap-1 rounded-sm border border-[var(--line)] px-2 py-0.5 text-xs"
          >
            <span className="h-2 w-2 rounded-[2px]" style={{ background: RESOURCE_COLOR[k] }} />
            {cost[k]}
          </span>
        ))}
      </div>

      {finishAt !== null ? (
        <p className="tabular text-sm text-[var(--accent-strong)]">
          Construindo… {remaining}s restantes
        </p>
      ) : (
        <button
          onClick={onUpgrade}
          disabled={!canAfford}
          className="w-full rounded-sm border border-[var(--accent)] py-2 text-sm text-[var(--accent-strong)] transition-colors enabled:hover:bg-[var(--accent-tint)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Evoluir
        </button>
      )}
    </div>
  );
}

function HeroPanel({
  points,
  attrs,
  onAllocate,
}: {
  points: number;
  attrs: Record<string, number>;
  onAllocate: (k: keyof typeof attrs) => void;
}) {
  const rank: Rank = "Visconde Superior";
  const exp = 320;
  const expMax = 500;

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex shrink-0 flex-col items-center gap-2 sm:w-40">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-sm border-2 font-display text-xl"
          style={{ borderColor: RANK_COLOR[rank], color: RANK_COLOR[rank] }}
        >
          H
        </div>
        <p className="font-display text-sm">Lidoky</p>
        <p className="text-[11px]" style={{ color: RANK_COLOR[rank] }}>
          {rank}
        </p>
        <div className="w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full bg-[var(--accent)]"
              style={{ width: `${(exp / expMax) * 100}%` }}
            />
          </div>
          <p className="tabular mt-1 text-center text-[10px] text-[var(--ink-faint)]">
            {exp}/{expMax} EXP
          </p>
        </div>
      </div>

      <div className="flex-1">
        <p className="mb-1 text-xs text-[var(--ink-faint)]">
          Pontos de atributo disponíveis:{" "}
          <span className="tabular text-[var(--accent-strong)]">{points}</span>
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
          {Object.entries(attrs).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-sm">
              <span className="capitalize text-[var(--ink-soft)]">{k}</span>
              <span className="flex items-center gap-2">
                <span className="tabular">{v}</span>
                <button
                  onClick={() => onAllocate(k)}
                  disabled={points <= 0}
                  className="h-4 w-4 rounded-sm border border-[var(--accent)] text-[10px] leading-none text-[var(--accent-strong)] enabled:hover:bg-[var(--accent-tint)] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  +
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-4 gap-1.5 sm:w-56 sm:grid-cols-4">
        {EQUIP_SLOTS.map((slot) => (
          <div
            key={slot}
            title={slot}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--line)] text-[9px] text-[var(--ink-faint)]"
          >
            {slot.slice(0, 3)}
          </div>
        ))}
      </div>
    </div>
  );
}
