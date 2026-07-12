"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface ReplayEvent {
  Seq: number;
  StatusId?: number;
  GameState?: string;
  Score?: { Participant1?: { Total?: { Goals?: number } }; Participant2?: { Total?: { Goals?: number } } };
  Clock?: { Seconds?: number };
}

interface ParsedReplayEvent {
  minute: number;
  label: string;
  homeScore: number;
  awayScore: number;
}

function parseReplayEvents(raw: unknown): ParsedReplayEvent[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const sorted = [...raw].sort((a: any, b: any) => (a.Seq || 0) - (b.Seq || 0));

  const labels: Record<string, string> = {
    "Kick off": "Kick off",
    "Goal": "⚽ Goal",
    "Yellow Card": "🟨 Yellow Card",
    "Red Card": "🟥 Red Card",
    "Corner": "⏩ Corner",
    "Substitution": "🔄 Substitution",
    "Half Time": "⏸️ Half Time",
    "Full Time": "⏱️ Full Time",
  };

  return sorted.map((e: any) => {
    const score = e.Score;
    const home = Number(score?.Participant1?.Total?.Goals ?? 0);
    const away = Number(score?.Participant2?.Total?.Goals ?? 0);
    const secs = Number(e.Clock?.Seconds ?? 0);
    const minute = Math.floor(secs / 60);
    const state = e.GameState ?? "Update";
    const label = labels[state] || state;

    return { minute, label, homeScore: home, awayScore: away };
  });
}

export default function ReplayPage() {
  const params = useParams();
  const fixtureId = Number(params.fixtureId);
  const [events, setEvents] = useState<ParsedReplayEvent[]>([]);
  const [fetchStatus, setFetchStatus] = useState<"loading" | "loaded" | "empty">("loading");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [eventIdx, setEventIdx] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFetchStatus("loading");
    fetch(`/api/replay/${fixtureId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const parsed = parseReplayEvents(data);
        if (parsed.length > 0) {
          setEvents(parsed);
          setFetchStatus("loaded");
        } else {
          setFetchStatus("empty");
        }
      })
      .catch(() => setFetchStatus("empty"));
  }, [fixtureId]);

  const advance = useCallback(() => {
    setEventIdx((prev) => {
      const next = prev + 1;
      if (next >= events.length) {
        setPlaying(false);
        setCompleted(true);
        return prev;
      }
      return next;
    });
  }, [events.length]);

  useEffect(() => {
    if (!playing || completed || events.length === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const delay = 3000 / speed;
    timerRef.current = setTimeout(advance, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, eventIdx, speed, completed, advance, events.length]);

  function handlePlay() {
    if (completed) {
      setCompleted(false);
      setEventIdx(-1);
    }
    setPlaying(true);
  }
  function handlePause() { setPlaying(false); }
  function handleRestart() {
    setEventIdx(-1);
    setCompleted(false);
    setPlaying(false);
  }

  const currentEvent = eventIdx >= 0 && eventIdx < events.length ? events[eventIdx] : null;

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <Link href="/app/matches" className="text-xs text-text-secondary/60 hover:text-text-primary">
        ← Matches
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Replay Mode</h1>
        <span className="rounded-full border border-violet/30 bg-violet/5 px-2.5 py-0.5 text-[10px] font-medium text-violet">
          REPLAY
        </span>
      </div>

      {fetchStatus === "loading" && (
        <p className="text-xs text-text-secondary/50">Loading replay data from TxLINE...</p>
      )}

      {fetchStatus === "empty" && (
        <div className="glass-elevated px-4 py-8 text-center">
          <span className="text-2xl">📭</span>
          <p className="mt-2 text-sm text-text-secondary">No historical data for this fixture</p>
          <p className="mt-1 text-xs text-text-secondary/50">
            TxLINE historical data is only available for matches with recorded events.
          </p>
          <Link
            href="/app/matches"
            className="mt-4 inline-block rounded-lg bg-coral/20 px-4 py-2 text-xs font-semibold text-coral transition-all hover:bg-coral/30"
          >
            Back to Matches
          </Link>
        </div>
      )}

      {fetchStatus === "loaded" && events.length > 0 && (
        <>
          <p className="text-xs leading-relaxed text-text-secondary">
            Replaying {events.length} events from TxLINE historical data.
          </p>

          {/* Scoreboard */}
          <div className="glass-elevated px-4 py-4">
            <div className="flex items-center justify-center gap-6">
              <span className="text-sm text-text-secondary">Home</span>
              <span className="text-3xl font-bold">
                {currentEvent?.homeScore ?? 0} - {currentEvent?.awayScore ?? 0}
              </span>
              <span className="text-sm text-text-secondary">Away</span>
            </div>
            <div className="mt-2 text-center font-mono text-xs text-text-secondary/50">
              {currentEvent?.minute ?? 0}'
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={handlePlay} disabled={playing || completed}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-coral/20 text-xs text-coral transition-all hover:bg-coral/30 disabled:opacity-30">▶</button>
                <button onClick={handlePause} disabled={!playing}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface text-xs text-text-secondary transition-all hover:bg-elevated disabled:opacity-30">⏸</button>
                <button onClick={handleRestart}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface text-xs text-text-secondary transition-all hover:bg-elevated">↺</button>
              </div>
              <div className="flex items-center gap-1">
                {[2, 4, 8, 16].map((s) => (
                  <button key={s} onClick={() => setSpeed(s)}
                    className={`cursor-pointer rounded-md px-2 py-1 text-[10px] font-mono transition-all ${speed === s ? "bg-coral/15 text-coral" : "text-text-secondary/40 hover:bg-surface hover:text-text-secondary"}`}>{s}x</button>
                ))}
              </div>
            </div>
          </div>

          {/* Current event */}
          {currentEvent && (
            <div className="glass-elevated px-4 py-3 text-center animate-fade-in-up">
              <p className="text-sm">
                <span className="font-mono text-text-secondary/50">{currentEvent.minute}'</span>{" "}
                {currentEvent.label}
              </p>
            </div>
          )}

          {/* Progress */}
          <div className="glass-elevated px-4 py-3">
            <div className="flex items-center justify-between text-[10px] text-text-secondary/50">
              <span>Event {eventIdx + 1} of {events.length}</span>
              <span>{Math.round(((eventIdx + 1) / events.length) * 100)}%</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-elevated overflow-hidden">
              <div className="h-1 rounded-full bg-coral transition-all duration-300"
                style={{ width: `${((eventIdx + 1) / events.length) * 100}%` }} />
            </div>
          </div>

          {/* Completed */}
          {completed && (
            <div className="glass-elevated border border-gold/20 px-4 py-6 text-center">
              <span className="text-2xl">🏆</span>
              <p className="mt-2 text-sm font-semibold text-gold">Replay Complete</p>
              <p className="mt-1 text-xs text-text-secondary/60">{events.length} events replayed</p>
              <div className="mt-4 flex justify-center gap-3">
                <button onClick={handlePlay}
                  className="rounded-lg bg-coral/20 px-4 py-2 text-xs font-semibold text-coral transition-all hover:bg-coral/30">🔄 Replay</button>
                <Link href="/app/matches"
                  className="rounded-lg border border-border px-4 py-2 text-xs text-text-secondary transition-all hover:bg-surface">More Matches</Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
