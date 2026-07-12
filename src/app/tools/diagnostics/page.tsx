"use client";

import { useEffect, useState } from "react";

export default function DiagnosticsPage() {
  const [data, setData] = useState<any>(null);
  const [fixtureId, setFixtureId] = useState("18222446");
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    fetch(`/api/diagnostics?fixtureId=${fixtureId}&raw=true`)
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setData({ error: e.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { run() }, []);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold">TxLINE Diagnostics</h1>

      <div className="flex items-center gap-3">
        <label className="text-sm text-text-secondary">Fixture ID:</label>
        <input
          value={fixtureId}
          onChange={(e) => setFixtureId(e.target.value)}
          className="flex-1 rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-violet/50"
        />
        <button
          onClick={run}
          disabled={loading}
          className="rounded-lg bg-coral px-4 py-2 text-sm font-medium text-white transition-all hover:bg-coral/80 active:scale-[0.97]"
        >
          {loading ? "..." : "Run"}
        </button>
      </div>

      {data && (
        <>
          {/* WC fixtures */}
          <Section title="World Cup fixtures on TxLINE">
            {data.worldCupFixtures?.length > 0 ? (
              <div className="flex flex-col gap-1">
                {data.worldCupFixtures.map((f: any) => (
                  <div key={f.id} className="rounded-lg bg-white/[4%] px-3 py-2 text-sm">
                    <span className="font-mono text-coral">{f.id}</span>{" "}
                    {f.home} vs {f.away} —{" "}
                    <span className="text-text-secondary">{new Date(f.startTime).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>No World Cup fixtures returned</Empty>
            )}
          </Section>

          {/* Endpoint results */}
          {["snapshot", "historical"].map((ep) => {
            const epData = data.endpoints?.[ep];
            const analysis = data.analysis?.[ep];
            if (!epData) return null;
            return (
              <Section key={ep} title={`/api/scores/${ep === "snapshot" ? `snapshot/${fixtureId}` : `historical/${fixtureId}`}`}>
                <StatusBadge status={epData.status} error={epData.error} elapsed={epData.elapsed} />

                {analysis && (
                  <>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <Info label="Total events" value={analysis.totalEvents} />
                      <Info label="Unique gameStates" value={analysis.gameStates.join(", ")} />
                      <Info label="Unique actions" value={analysis.actions.join(", ")} />
                      <Info label="Sample keys" value={analysis.sampleKeys.slice(0, 20).join(", ")} />
                    </div>

                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {Object.entries(analysis.mapping).map(([key, val]) => (
                        <div key={key} className={`rounded-lg px-2 py-1.5 text-center text-[11px] font-medium ${val ? "bg-mint/10 text-mint" : "bg-coral/10 text-coral"}`}>
                          {key}
                          <br />
                          {val ? "✓ maps" : "✗ no match"}
                        </div>
                      ))}
                    </div>

                    {/* Show first 5 raw events */}
                    {epData.raw && Array.isArray(epData.raw) && (
                      <div className="mt-3">
                        <p className="mb-1 text-xs text-text-secondary">First 5 raw events:</p>
                        <pre className="overflow-auto rounded-lg bg-black/30 p-3 text-[11px] text-text-secondary leading-relaxed">
                          {JSON.stringify(epData.raw.slice(0, 5), null, 2)}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </Section>
            );
          })}

          {/* Raw fixtures response */}
          <Section title="Raw fixtures snapshot">
            {data.endpoints?.fixtures?.raw && Array.isArray(data.endpoints.fixtures.raw) ? (
              <pre className="overflow-auto rounded-lg bg-black/30 p-3 text-[11px] text-text-secondary leading-relaxed">
                {JSON.stringify(data.endpoints.fixtures.raw.slice(0, 3), null, 2)}
              </pre>
            ) : (
              <Empty>No fixture data</Empty>
            )}
          </Section>
        </>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[6%] bg-surface p-4">
      <h2 className="mb-3 text-sm font-semibold text-text-primary">{title}</h2>
      {children}
    </div>
  );
}

function StatusBadge({ status, error, elapsed }: { status: number; error: string | null; elapsed: number }) {
  const ok = status >= 200 && status < 300;
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-[11px] font-medium ${ok ? "bg-mint/10 text-mint" : "bg-coral/10 text-coral"}`}>
      {ok ? "✓" : "✗"} HTTP {status} — {elapsed}ms
      {error && <span className="text-coral">({error})</span>}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-white/[4%] px-3 py-2">
      <span className="text-[10px] uppercase tracking-wider text-text-secondary/50">{label}</span>
      <p className="mt-0.5 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-text-secondary/50">{children}</p>;
}
