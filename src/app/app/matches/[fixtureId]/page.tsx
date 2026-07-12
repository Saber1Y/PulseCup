"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { TxLINEFixture } from "@/lib/types";

interface ParsedScore {
  homeScore: number;
  awayScore: number;
  minute: number;
  status: string;
}

function parseScore(raw: unknown): ParsedScore | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const sorted = [...raw].sort((a: any, b: any) => (b.Seq || 0) - (a.Seq || 0));
  const event = sorted[0] as any;
  const score = event.Score;
  const home = Number(score?.Participant1?.Total?.Goals ?? 0);
  const away = Number(score?.Participant2?.Total?.Goals ?? 0);
  const secs = Number(event.Clock?.Seconds ?? 0);
  const statusId = event.StatusId;
  const status = statusId === 5 || statusId === 7 || statusId === 9 ? "finished" : statusId >= 2 ? "live" : "scheduled";
  return { homeScore: home, awayScore: away, minute: Math.floor(secs / 60), status };
}

const statusBadge = (s: string) => {
  if (s === "live") return { label: "LIVE", cls: "bg-coral/10 text-coral" };
  if (s === "finished") return { label: "Final", cls: "bg-gold/10 text-gold" };
  return { label: "Upcoming", cls: "bg-text-secondary/10 text-text-secondary" };
};

export default function LiveRoom() {
  const params = useParams();
  const fixtureId = Number(params.fixtureId);
  const [fixture, setFixture] = useState<TxLINEFixture | null>(null);
  const [score, setScore] = useState<ParsedScore | null>(null);
  const [scoreStatus, setScoreStatus] = useState<"loading" | "loaded" | "empty">("loading");

  useEffect(() => {
    fetch("/api/matches")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: TxLINEFixture[]) => {
        const f = list.find((x) => x.id === fixtureId);
        if (f) setFixture(f);
      })
      .catch(() => {});
  }, [fixtureId]);

  useEffect(() => {
    fetch(`/api/scores/${fixtureId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const p = parseScore(data);
        if (p) {
          setScore(p);
          setScoreStatus("loaded");
        } else {
          setScoreStatus("empty");
        }
      })
      .catch(() => setScoreStatus("empty"));
  }, [fixtureId]);

  const displayStatus = score?.status ?? (fixture && new Date(fixture.startDate).getTime() < Date.now() ? "finished" : "upcoming");

  const badge = statusBadge(displayStatus);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <Link href="/app/matches" className="text-xs text-text-secondary/60 hover:text-text-primary">
        ← Matches
      </Link>

      {/* Match header */}
      <div className="glass-elevated px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-medium text-text-secondary/50">
            {fixture?.competition ?? "Loading..."}
          </span>
          <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold ${badge.cls}`}>
            {displayStatus === "live" && <span className="h-1.5 w-1.5 animate-live-dot rounded-full bg-coral" />}
            {badge.label}
          </span>
        </div>

        {scoreStatus === "loading" ? (
          <div className="flex items-center justify-center py-6 text-xs text-text-secondary/50">
            Loading score...
          </div>
        ) : scoreStatus === "empty" ? (
          <div className="flex flex-col items-center py-6">
            <span className="text-xs text-text-secondary/50">No score data available</span>
            {fixture && (
              <p className="mt-1 text-[10px] text-text-secondary/30">
                {new Date(fixture.startDate).toLocaleString()}
              </p>
            )}
          </div>
        ) : score ? (
          <>
            <div className="flex items-center justify-center gap-5">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">
                  {fixture?.homeTeam.charAt(0) ?? "?"}
                </div>
                <span className="text-xs text-text-secondary">{fixture?.homeTeam ?? "Home"}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">{score.homeScore} - {score.awayScore}</span>
                <span className="font-mono text-xs text-text-secondary/50">{score.minute}'</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">
                  {fixture?.awayTeam.charAt(0) ?? "?"}
                </div>
                <span className="text-xs text-text-secondary">{fixture?.awayTeam ?? "Away"}</span>
              </div>
            </div>
            {scoreStatus === "loaded" && (
              <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-mint">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                TxLINE data
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Reactions */}
      <div className="glass-elevated px-4 py-4">
        <span className="text-[11px] font-medium text-text-secondary">Reactions</span>
        <p className="mt-1 text-xs text-text-secondary/50">
          Reaction prompts appear when TxLINE match events are available.
        </p>
      </div>

      {/* Challenge placeholder */}
      <div className="glass-elevated px-4 py-4">
        <span className="text-[11px] font-medium text-text-secondary">Challenge</span>
        <p className="mt-1 text-xs text-text-secondary/50">
          Challenges are generated from live match events.
        </p>
      </div>

      {/* Event feed */}
      <div className="glass-elevated px-4 py-4">
        <span className="text-[11px] font-medium text-text-secondary">Match Events</span>
        <p className="mt-1 text-xs text-text-secondary/50">
          TxLINE event stream not available for this fixture.
        </p>
      </div>

      {/* Streak */}
      <div className="glass-elevated px-4 py-4">
        <span className="text-[11px] font-medium text-text-secondary">Streak</span>
        <p className="mt-1 text-xs text-text-secondary/50">
          Your streak appears after answering challenges.
        </p>
      </div>

      {/* Replay CTA for finished matches */}
      {displayStatus === "finished" && (
        <Link
          href={`/app/replay/${fixtureId}`}
          className="mb-8 flex items-center justify-center gap-2 rounded-xl border border-violet/30 bg-violet/5 px-4 py-3 text-sm font-medium text-violet transition-all hover:bg-violet/10 active:scale-[0.97]"
        >
          <span>↺</span> Open in Replay Mode
        </Link>
      )}
    </div>
  );
}
