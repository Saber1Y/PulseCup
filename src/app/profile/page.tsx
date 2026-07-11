"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MatchHistory {
  fixtureId: number;
  teams: string;
  reactions: number;
  streak: number;
  date: string;
}

export default function Profile() {
  const [history, setHistory] = useState<MatchHistory[]>([]);

  useEffect(() => {
    // TODO: fetch from Supabase
    setHistory([]);
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-16 pt-6">
      <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400">
        ← Home
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-accent/30 to-cyan-accent/30 text-2xl">
          👤
        </div>
        <div>
          <h1 className="text-xl font-bold">Fan Profile</h1>
          <p className="text-xs text-zinc-500">
            {history.length > 0
              ? `${history.length} matches watched`
              : "Connect wallet or email to save your pulse"}
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass-card px-4 py-8 text-center">
          <span className="text-3xl">📊</span>
          <p className="mt-3 text-sm text-zinc-400">No match history yet</p>
          <p className="mt-1 text-xs text-zinc-600">Watch a match to build your fan profile</p>
          <Link
            href="/matches"
            className="mt-4 inline-block rounded-xl bg-green-accent px-5 py-2.5 text-xs font-semibold text-pitch"
          >
            Find a Match
          </Link>
        </div>
      ) : (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Match History
          </h2>
          <div className="flex flex-col gap-2">
            {history.map((m) => (
              <div key={m.fixtureId} className="glass-card flex items-center justify-between px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-zinc-200">{m.teams}</span>
                  <p className="text-[10px] text-zinc-600">{m.date}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>🔥 {m.streak}</span>
                  <span>💬 {m.reactions}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
