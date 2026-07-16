"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { TxLINEFixture } from "@/lib/types";
import { TeamWithFlag } from "@/lib/flags";

const TABS = ["All", "Live", "Upcoming", "Finished", "Replay"] as const;
type Tab = (typeof TABS)[number];

function statusFromFixture(f: TxLINEFixture): "live" | "upcoming" | "finished" {
  const elapsed = Date.now() - new Date(f.startDate).getTime();
  if (elapsed < 0) return "upcoming";
  if (elapsed < 4 * 3600000) return "live";
  return "finished";
}

function MatchCard({ f }: { f: TxLINEFixture }) {
  const status = statusFromFixture(f);
  return (
    <Link
      href={
        status === "finished" ? `/app/replay/${f.id}` : `/app/matches/${f.id}`
      }
      className="glass-elevated flex flex-col gap-3 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-coral/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === "live" && (
            <span className="flex items-center gap-1.5 text-[10px] text-coral">
              <span className="h-1.5 w-1.5 animate-live-dot rounded-full bg-coral" />
              Live
            </span>
          )}
          {status === "upcoming" && (
            <span className="text-[10px] text-text-secondary/50">Upcoming</span>
          )}
          {status === "finished" && (
            <span className="text-[10px] text-gold">Final</span>
          )}
        </div>
        <span className="text-[10px] font-mono text-text-secondary/40">
          {status === "upcoming"
            ? new Date(f.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : status === "live"
              ? "Live"
              : "Replay available"}
        </span>
      </div>
      <div className="flex items-center justify-center gap-6">
        <TeamWithFlag name={f.homeTeam} className="text-sm font-medium text-text-primary" />
        <span className="text-lg font-bold">
          {status === "upcoming" ? "vs" : status === "live" ? "2 - 1" : "Replay"}
        </span>
        <TeamWithFlag name={f.awayTeam} className="text-sm font-medium text-text-primary" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === "live" && (
            <>
              <span className="text-[10px] text-text-secondary/60">🔥 streak ready</span>
              <span className="text-[10px] text-text-secondary/60">· 2 challenges</span>
            </>
          )}
        </div>
        <span className="text-xs font-medium text-coral">
          {status === "finished" ? "Replay →" : "Open match →"}
        </span>
      </div>
    </Link>
  );
}

function MatchHub() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [fixtures, setFixtures] = useState<TxLINEFixture[]>([]);

  useEffect(() => {
    if (tabFromUrl === "live") setActiveTab("Live");
    else if (tabFromUrl === "replay") setActiveTab("Replay");
  }, [tabFromUrl]);

  useEffect(() => {
    fetch("/api/matches")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: TxLINEFixture[]) => {
        const sorted = [...list].sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        );
        setFixtures(sorted);
      })
      .catch(() => {});
  }, []);

  const filtered = fixtures.filter((f) => {
    const s = statusFromFixture(f);
    if (activeTab === "Live") return s === "live";
    if (activeTab === "Upcoming") return s === "upcoming";
    if (activeTab === "Finished") return s === "finished";
    if (activeTab === "Replay") return s === "finished";
    return true;
  });

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">World Cup Pulse</h1>
          <p className="text-xs text-text-secondary">
            Pick a match, react live, and build your streak.
          </p>
        </div>
        <Link
          href="/app/replay/18237038"
          className="rounded-lg border border-violet/30 bg-violet/5 px-3 py-1.5 text-[10px] font-medium text-violet transition-all hover:bg-violet/10"
        >
          Demo replay
        </Link>
      </div>
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition-all ${
              activeTab === t
                ? "bg-coral/15 text-coral"
                : "text-text-secondary/50 hover:bg-surface hover:text-text-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 pb-8">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-text-secondary">No matches in this view yet.</p>
            {activeTab === "Live" && (
              <p className="mt-1 text-xs text-text-secondary/50">
                Try the Replay tab to see a demo.
              </p>
            )}
          </div>
        ) : (
          filtered.map((f) => <MatchCard key={f.id} f={f} />)
        )}
      </div>
    </div>
  );
}

export default function MatchHubPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 text-sm text-text-secondary">Loading...</div>}>
      <MatchHub />
    </Suspense>
  );
}
