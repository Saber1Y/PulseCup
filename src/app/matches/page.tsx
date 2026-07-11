"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TxLINEFixture } from "@/lib/types";

function getMatchStatus(f: TxLINEFixture): "live" | "upcoming" | "finished" {
  const elapsed = Date.now() - new Date(f.startDate).getTime();
  if (elapsed < 0) return "upcoming";
  if (elapsed < 4 * 3600000) return "live";
  return "finished";
}

function FixtureCard({ f }: { f: TxLINEFixture }) {
  const status = getMatchStatus(f);

  return (
    <Link
      href={`/matches/${f.id}`}
      className="glass-card flex items-center justify-between px-4 py-3 transition-all hover:bg-white/[0.04]"
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-zinc-400">{f.homeTeam}</span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        {status === "live" ? (
          <>
            <span className="text-xl font-bold tracking-tight text-white">1 - 1</span>
            <span className="flex items-center gap-1 text-[10px] text-red-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              LIVE
            </span>
          </>
        ) : (
          <>
            <span className="text-base font-semibold text-zinc-400">vs</span>
            <span className="text-[10px] font-mono text-zinc-600">
              {new Date(f.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </>
        )}
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-zinc-400">{f.awayTeam}</span>
      </div>
    </Link>
  );
}

export default function MatchHub() {
  const [fixtures, setFixtures] = useState<TxLINEFixture[]>([]);

  useEffect(() => {
    fetch("/api/matches").then((r) => r.ok ? r.json() : []).then(setFixtures).catch(() => {});
  }, []);

  const live = fixtures.filter((f) => getMatchStatus(f) === "live");
  const upcoming = fixtures.filter((f) => getMatchStatus(f) === "upcoming");

  return (
    <div className="flex flex-col gap-6 pb-16 pt-6">
      <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400">
        ← Back
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Match Hub</h1>

      {live.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Live
          </h2>
          <div className="flex flex-col gap-2">
            {live.map((f) => (
              <FixtureCard key={f.id} f={f} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Upcoming
          </h2>
          <div className="flex flex-col gap-2">
            {upcoming.map((f) => (
              <FixtureCard key={f.id} f={f} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
