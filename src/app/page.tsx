import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 text-center">
        {/* Motion background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -left-32 -top-32 h-96 w-96 animate-blob rounded-full bg-coral/10 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 animate-blob rounded-full bg-violet/10 blur-[120px]" style={{ animationDelay: "-7s" }} />
          <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 animate-blob rounded-full bg-gold/5 blur-[100px]" style={{ animationDelay: "-14s" }} />
          {/* Pulse rings */}
          <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring rounded-full border border-coral/20" />
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring rounded-full border border-violet/15" style={{ animationDelay: "1s" }} />
          {/* Crowd wave */}
          <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden opacity-[0.04]">
            <div className="flex animate-wave gap-8" style={{ width: "200%" }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="h-8 w-8 rounded-full border border-text-primary" style={{ marginTop: `${Math.sin(i * 0.5) * 16 + 8}px` }} />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i + 20} className="h-8 w-8 rounded-full border border-text-primary" style={{ marginTop: `${Math.sin(i * 0.5) * 16 + 8}px` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <span className="mb-4 rounded-full border border-coral/20 bg-coral/10 px-4 py-1 text-[11px] font-medium uppercase tracking-widest text-coral">
          Live World Cup fan energy
        </span>

        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          React to the match{' '}
          <span className="text-gradient">as it happens.</span>
        </h1>

        <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary">
          PulseCup turns live World Cup data into instant fan reactions, quick streak challenges, and shareable match recap cards.
        </p>

        {/* Status pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            "TxLINE · live match data",
            "Fan reactions · real-time",
            "Streak challenges · replayable",
            "Solana · optional sign-in",
          ].map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium text-text-secondary"
            >
              {pill}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/app/matches"
            className="rounded-xl bg-coral px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-coral/20 transition-all hover:bg-coral/90 hover:shadow-coral/30 active:scale-[0.97]"
          >
            Enter live matches
          </Link>
          <Link
            href="/app/replay/1"
            className="rounded-xl border border-border bg-surface px-8 py-3 text-sm font-medium text-text-secondary transition-all hover:border-text-secondary/20 hover:text-text-primary active:scale-[0.97]"
          >
            Try replay mode
          </Link>
        </div>

        {/* Phone mockup */}
        <div className="mt-16 w-full max-w-[320px]">
          <div className="glass-elevated rounded-3xl border-border/40 p-2 shadow-2xl">
            <div className="rounded-2xl bg-bg-deep px-5 py-6">
              {/* Status bar */}
              <div className="mb-4 flex items-center justify-between text-[10px]">
                <span className="text-text-secondary">9:41</span>
                <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[9px] font-semibold text-coral">
                  LIVE · 67'
                </span>
              </div>
              {/* Score */}
              <div className="mb-4 flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">NC</div>
                  <span className="text-[10px] text-text-secondary">North City</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">1 - 1</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">SC</div>
                  <span className="text-[10px] text-text-secondary">South Coast</span>
                </div>
              </div>
              {/* Current challenge */}
              <div className="mb-3 rounded-xl border border-coral/20 bg-coral/5 px-4 py-3">
                <p className="text-[11px] font-medium text-coral">Current challenge</p>
                <p className="mt-1 text-xs text-text-primary">Will there be another goal before 75'?</p>
                <div className="mt-2 flex gap-2">
                  <button className="flex-1 rounded-lg border border-border px-3 py-1.5 text-[11px] font-medium text-text-secondary transition-all hover:bg-surface active:scale-[0.97]">Yes</button>
                  <button className="flex-1 rounded-lg border border-border px-3 py-1.5 text-[11px] font-medium text-text-secondary transition-all hover:bg-surface active:scale-[0.97]">No</button>
                </div>
              </div>
              {/* Reactions */}
              <div className="flex justify-between px-2">
                {[
                  { emoji: "🔥", label: "Called it", pct: "42%" },
                  { emoji: "😱", label: "Shocked", pct: "28%" },
                  { emoji: "💀", label: "It's over", pct: "18%" },
                  { emoji: "🧊", label: "Still calm", pct: "12%" },
                ].map((r) => (
                  <div key={r.emoji} className="flex flex-col items-center gap-0.5">
                    <span className="text-lg">{r.emoji}</span>
                    <span className="text-[9px] text-text-secondary">{r.pct}</span>
                  </div>
                ))}
              </div>
              {/* Streak */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px]">
                <span className="text-gold">🔥</span>
                <span className="font-semibold text-gold">Current streak: 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-text-secondary/50">Scroll</span>
            <div className="h-6 w-[1px] bg-text-secondary/20" />
          </div>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className="px-4 py-24 md:py-32">
        <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
          A match companion fans actually open.
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              num: "01",
              title: "Live moments become fan prompts",
              body: "Goals, cards, corners, and momentum shifts trigger instant reaction prompts fans can tap in seconds.",
              badge: "Live reactions",
              border: "hover:border-coral/30",
            },
            {
              num: "02",
              title: "Quick challenges, not complex markets",
              body: "Fans answer simple questions like \"Will there be another goal soon?\" and build streaks as the match unfolds.",
              badge: "Streak game",
              border: "hover:border-violet/30",
            },
            {
              num: "03",
              title: "Replay any match like it is live",
              body: "When no match is currently active, Replay Mode uses historical TxLINE-style data to demonstrate the full experience.",
              badge: "Replay mode",
              border: "hover:border-gold/30",
            },
            {
              num: "04",
              title: "Share the match you just lived",
              body: "After the final whistle, fans get a recap card showing their reactions, streaks, and best calls.",
              badge: "Share cards",
              border: "hover:border-mint/30",
            },
          ].map((card) => (
            <div
              key={card.num}
              className={`glass-elevated group cursor-default px-6 py-6 transition-all hover:-translate-y-0.5 ${card.border}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-secondary/40">{card.num}</span>
                <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[10px] font-medium text-text-secondary">
                  {card.badge}
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold">{card.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="px-4 py-24 md:py-32">
        <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">How PulseCup works</h2>
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-4">
          {[
            { step: "01", title: "Pick a match", desc: "Open a live, upcoming, finished, or replayable World Cup fixture." },
            { step: "02", title: "React to moments", desc: "When TxLINE match data updates, PulseCup turns the moment into a quick fan reaction prompt." },
            { step: "03", title: "Play streak challenges", desc: "Guess simple next-moment outcomes and build your streak during the match." },
            { step: "04", title: "Share your recap", desc: "Generate a match card showing your best streak, reaction speed, and fan mood." },
          ].map((s) => (
            <div key={s.step} className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-coral/10 text-sm font-bold text-coral">
                {s.step}
              </div>
              <h3 className="mb-2 text-sm font-semibold">{s.title}</h3>
              <p className="text-xs leading-relaxed text-text-secondary">{s.desc}</p>
              {s.step !== "04" && (
                <div className="mt-4 hidden h-px w-8 bg-border md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== MAIN FEATURE PREVIEW ===== */}
      <section className="px-4 py-24 md:py-32">
        <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">The live room</h2>
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center">
          {/* Phone mockup */}
          <div className="w-full max-w-[300px] shrink-0">
            <div className="glass-elevated rounded-3xl border-border/40 p-2 shadow-2xl">
              <div className="rounded-2xl bg-bg-deep px-5 py-6">
                <div className="mb-3 flex items-center justify-between text-[10px]">
                  <span className="text-text-secondary">9:41</span>
                  <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[9px] font-semibold text-coral">LIVE · 82'</span>
                </div>
                <div className="mb-4 flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">MU</div>
                    <span className="text-[9px] text-text-secondary">Metro Utd</span>
                  </div>
                  <span className="text-2xl font-bold">2 - 1</span>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">VF</div>
                    <span className="text-[9px] text-text-secondary">Valley FC</span>
                  </div>
                </div>
                {/* Fan Pulse */}
                <div className="mb-3 rounded-xl bg-surface px-3 py-3">
                  <span className="text-[10px] font-medium text-text-secondary">Fan Pulse</span>
                  {[
                    { emoji: "🔥", label: "Called it", pct: 48 },
                    { emoji: "😱", label: "Shocked", pct: 31 },
                    { emoji: "💀", label: "Game over", pct: 14 },
                    { emoji: "🧊", label: "Calm", pct: 7 },
                  ].map((r) => (
                    <div key={r.emoji} className="mt-1.5 flex items-center gap-2">
                      <span className="w-4 text-xs">{r.emoji}</span>
                      <div className="flex-1">
                        <div className="h-1.5 rounded-full bg-elevated">
                          <div
                            className="h-1.5 rounded-full bg-coral transition-all"
                            style={{ width: `${r.pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-8 text-right text-[10px] text-text-secondary">{r.pct}%</span>
                    </div>
                  ))}
                </div>
                {/* Challenge */}
                <div className="mb-2 rounded-xl border border-coral/20 bg-coral/5 px-3 py-2.5">
                  <p className="text-[9px] font-medium text-coral">Challenge</p>
                  <p className="text-[11px] text-text-primary">Will Valley FC get one more big chance?</p>
                  <div className="mt-1.5 flex gap-2">
                    <button className="flex-1 rounded-lg border border-border px-2 py-1 text-[10px] text-text-secondary transition-all hover:bg-surface">Yes</button>
                    <button className="flex-1 rounded-lg border border-border px-2 py-1 text-[10px] text-text-secondary transition-all hover:bg-surface">No</button>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 text-[10px]">
                  <span className="text-gold">🔥</span>
                  <span className="font-semibold text-gold">Streak: 5</span>
                </div>
              </div>
            </div>
          </div>
          {/* Feature bullets */}
          <div className="flex flex-col gap-4 md:pt-8">
            {[
              "Event-triggered reaction prompts",
              "Live challenge cards",
              "Fan pulse meter",
              "Streak scoring",
              "Replay mode for judges",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral/10 text-[10px] text-coral">✓</div>
                <span className="text-sm text-text-secondary">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WORKFLOW DIAGRAM ===== */}
      <section className="px-4 py-24 md:py-32">
        <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
          How live match data becomes a fan moment.
        </h2>
        <div className="relative overflow-x-auto pb-8">
          <div className="flex min-w-[800px] flex-col gap-8">
            {/* Main flow */}
            <div className="flex items-center gap-3">
              {[
                { label: "TxLINE event", tint: "border-mint/30 bg-mint/5", icon: "⌔" },
                { label: "Normalize event", tint: "border-violet/30 bg-violet/5", icon: "⊞" },
                { label: "Moment engine", tint: "border-coral/30 bg-coral/5", icon: "✦" },
                { label: "Fan prompt created", tint: "border-gold/30 bg-gold/5", icon: "◈" },
                { label: "User responds", tint: "border-coral/30 bg-coral/5", icon: "☰" },
                { label: "Streak updated", tint: "border-gold/30 bg-gold/5", icon: "★" },
                { label: "Share recap", tint: "border-violet/30 bg-violet/5", icon: "▣" },
              ].map((node, i) => (
                <div key={node.label} className="flex flex-col items-center">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border ${node.tint}`}>
                    <span className="text-sm font-light text-text-secondary" style={{ fontFamily: "sans-serif" }}>{node.icon}</span>
                  </div>
                  <span className="mt-2 w-20 text-center text-[10px] leading-tight text-text-secondary">{node.label}</span>
                  {i < 6 && <div className="mt-2 h-px w-3 bg-border/40" />}
                </div>
              ))}
            </div>
            {/* Lower branch — replay */}
            <div className="flex items-center gap-3 pl-8">
              {[
                { label: "Replay engine", tint: "border-violet/30 bg-violet/5", icon: "↺" },
              ].map((node) => (
                <div key={node.label} className="flex flex-col items-center">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border ${node.tint}`}>
                    <span className="text-sm font-light text-text-secondary" style={{ fontFamily: "sans-serif" }}>{node.icon}</span>
                  </div>
                  <span className="mt-2 w-20 text-center text-[10px] leading-tight text-text-secondary">{node.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1 text-[10px] text-text-secondary/60">
                <span>feeds into</span>
                <span className="inline-block h-px w-6 bg-border/40" />
                <span className="text-coral">Normalize event</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="border-y border-border px-4 py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-8">
          {[
            { label: "1 tap reactions" },
            { label: "Live match prompts" },
            { label: "Replayable demos" },
            { label: "Shareable recap cards" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-coral" />
              <span className="text-sm font-medium text-text-secondary">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== REPLAY SECTION ===== */}
      <section className="px-4 py-24 md:py-32">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">No live match? Replay one.</h2>
        <p className="mx-auto mb-8 max-w-lg text-center text-sm leading-relaxed text-text-secondary">
          PulseCup includes a Replay Mode so judges and fans can experience a full match flow even when no World Cup game is live.
        </p>
        <div className="mx-auto max-w-sm">
          <div className="glass-elevated px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold">Demo Replay</span>
                <p className="text-[11px] text-text-secondary">North City vs South Coast</p>
              </div>
              <span className="rounded-full border border-violet/30 bg-violet/5 px-2.5 py-0.5 text-[10px] font-medium text-violet">
                REPLAY
              </span>
            </div>
            <div className="mb-4 flex flex-col gap-1.5">
              {[
                { min: "12'", evt: "Goal" },
                { min: "31'", evt: "Yellow card" },
                { min: "55'", evt: "Corner" },
                { min: "72'", evt: "Goal" },
                { min: "90'", evt: "Final whistle" },
              ].map((evt) => (
                <div key={evt.min} className="flex items-center gap-3">
                  <span className="w-8 font-mono text-[10px] text-text-secondary/50">{evt.min}</span>
                  <div className="h-px flex-1 bg-border/30" />
                  <span className="text-xs text-text-secondary">{evt.evt}</span>
                </div>
              ))}
            </div>
            <Link
              href="/app/replay/1"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet/90 active:scale-[0.97]"
            >
              <span>▶</span> Start replay
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TRANSPARENCY ===== */}
      <section className="px-4 py-24 md:py-32">
        <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
          Built for fans, powered by real match data.
        </h2>
        <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
          {[
            {
              title: "TxLINE integration",
              body: "PulseCup uses TxLINE match data to power live event prompts, score changes, and replayable match timelines.",
            },
            {
              title: "No betting layer",
              body: "PulseCup is a social fan game. There are no wagers, escrow pools, odds trading, or payouts.",
            },
            {
              title: "Replay-safe demo",
              body: "Finished matches can be replayed for demo purposes, but real live interactions are clearly separated from replay mode.",
            },
          ].map((card) => (
            <div key={card.title} className="glass-elevated px-5 py-5">
              <h3 className="mb-2 text-sm font-semibold">{card.title}</h3>
              <p className="text-xs leading-relaxed text-text-secondary">{card.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-text-secondary/60">
            PulseCup is a social fan experience. It does not support betting, wagers, or payouts.
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <div>
            <span className="text-lg font-bold">
              Pulse<span className="text-gradient">Cup</span>
            </span>
            <p className="mt-1 text-xs text-text-secondary">Feel every match moment.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-xs text-text-secondary transition-colors hover:text-text-primary">How it works</a>
            <Link href="/app/matches" className="text-xs text-text-secondary transition-colors hover:text-text-primary">Live rooms</Link>
            <Link href="/app/replay/1" className="text-xs text-text-secondary transition-colors hover:text-text-primary">Replay demo</Link>
            <a href="https://github.com/Saber1Y/PulseCup" target="_blank" rel="noopener noreferrer" className="text-xs text-text-secondary transition-colors hover:text-text-primary">GitHub</a>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            Live moment engine: operational
          </div>
        </div>
      </footer>
    </div>
  );
}
