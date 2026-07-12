"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import type { PulseCupEvent, GeneratedMoment, Challenge, UserStreak, TxLINEFixture } from "@/lib/types";
import { normalizeTxLINEArray } from "@/lib/txline/normalize-event";
import { createMomentFromEvent } from "@/lib/pulse/moment-engine";
import { createChallenge, resolveChallenge } from "@/lib/pulse/challenge-engine";
import { createStreak, applyCorrectAnswer, applyWrongAnswer } from "@/lib/pulse/streak-engine";
import { getGuestProfileId } from "@/lib/guest";
import { ReactionPanel } from "@/components/live/ReactionPanel";
import { ChallengeCard } from "@/components/live/ChallengeCard";
import { EventFeed } from "@/components/live/EventFeed";
import { StreakBar } from "@/components/live/StreakBar";

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
  const profileId = useRef<string | null>(null);

  const [fixture, setFixture] = useState<TxLINEFixture | null>(null);
  const [score, setScore] = useState<ParsedScore | null>(null);
  const [scoreStatus, setScoreStatus] = useState<"loading" | "loaded" | "empty">("loading");
  const [normalizedEvents, setNormalizedEvents] = useState<PulseCupEvent[]>([]);
  const [activeMoment, setActiveMoment] = useState<GeneratedMoment | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [streak, setStreak] = useState<UserStreak | null>(null);

  // Track seen TxLINE sequences and created challenge type+fixture combos
  const seenSeqs = useRef<Set<number>>(new Set());
  const createdChallengeKeys = useRef<Set<string>>(new Set());

  // Initialize profileId
  useEffect(() => {
    profileId.current = getGuestProfileId();
  }, []);

  // Fetch fixture info
  useEffect(() => {
    fetch("/api/matches")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: TxLINEFixture[]) => {
        const f = list.find((x) => x.id === fixtureId);
        if (f) setFixture(f);
      })
      .catch(() => {});
  }, [fixtureId]);

  // Process raw events through the engine
  const processRawEvents = useCallback((raw: unknown) => {
    if (!Array.isArray(raw) || raw.length === 0) return;

    const newEvents = normalizeTxLINEArray(raw).filter(
      (e: PulseCupEvent) => !seenSeqs.current.has(e.txlineSequence),
    );

    if (newEvents.length === 0) return;

    // Mark all as seen
    newEvents.forEach((e: PulseCupEvent) => seenSeqs.current.add(e.txlineSequence));

    // Update score from latest event
    const latest = newEvents[newEvents.length - 1];
    setScore({
      homeScore: latest.homeScore,
      awayScore: latest.awayScore,
      minute: latest.minute,
      status: latest.type === "MATCH_ENDED" ? "finished" : "live",
    });

    // Update event list
    setNormalizedEvents((prev) => [...prev, ...newEvents]);

    // Process each new event through the moment engine
    for (const evt of newEvents) {
      const moment = createMomentFromEvent(evt);

      // Show reaction prompt
      setActiveMoment(moment);
      setActiveEventId(evt.id);

      // Generate challenge if applicable
      if (moment.challenge) {
        const chKey = `${evt.fixtureId}-${moment.challenge.type}-${evt.txlineSequence}`;
        if (!createdChallengeKeys.current.has(chKey)) {
          createdChallengeKeys.current.add(chKey);
          const ch = createChallenge(
            moment.challenge.type,
            moment.challenge.prompt,
            moment.challenge.options,
            evt,
          );

          // POST to API for persistence
          fetch("/api/challenges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ challenges: [ch] }),
          }).catch(() => {});

          setChallenges((prev) => [...prev, ch]);
        }
      }

      // Try to resolve existing open challenges
      setChallenges((prev) => {
        let updated = [...prev];
        for (const ch of updated) {
          if (ch.status !== "OPEN") continue;
          const resolved = resolveChallenge(ch, evt);
          if (resolved) {
            updated = updated.map((c) => (c.id === resolved.id ? resolved : c));
            // POST to resolve endpoint for persistence
            fetch("/api/challenges/resolve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fixtureId, rawEvents: [evt.raw] }),
            }).catch(() => {});
          }
        }
        return updated;
      });
    }
  }, [fixtureId]);

  // Poll for score/events
  useEffect(() => {
    if (!fixtureId) return;

    let mounted = true;
    let interval: ReturnType<typeof setInterval>;

    const poll = async () => {
      try {
        const res = await fetch(`/api/scores/${fixtureId}`);
        if (!res.ok || !mounted) return;
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setScoreStatus("loaded");
          processRawEvents(data);
        } else {
          setScoreStatus("empty");
        }
      } catch {
        if (mounted) setScoreStatus("empty");
      }
    };

    poll();
    interval = setInterval(poll, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fixtureId, processRawEvents]);

  // Fetch existing challenges on mount
  useEffect(() => {
    if (!fixtureId) return;
    fetch(`/api/challenges?fixtureId=${fixtureId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setChallenges(
            data.map((c: any) => ({
              id: c.id,
              fixtureId: c.fixture_id,
              type: c.challenge_type,
              prompt: c.prompt,
              options: c.options,
              status: c.status,
              correctOptionIndex: c.correct_option_index,
              triggerEventId: c.trigger_event_id,
              createdByEventId: c.created_by_event_id,
              createdAt: c.created_at,
              resolvedAt: c.resolved_at,
            })),
          );
          data.forEach((c: any) => {
            createdChallengeKeys.current.add(
              `${c.fixture_id}-${c.challenge_type}-${c.created_by_event_id}`,
            );
          });
        }
      })
      .catch(() => {});
  }, [fixtureId]);

  // Fetch streak on mount
  useEffect(() => {
    if (!profileId.current || !fixtureId) return;
    fetch(`/api/streaks?profileId=${profileId.current}&fixtureId=${fixtureId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: UserStreak | null) => {
        if (data) setStreak(data);
      })
      .catch(() => {});
  }, [fixtureId]);

  // Handle challenge answer
  const handleAnswered = useCallback((correct: boolean) => {
    if (!profileId.current) return;
    const now = Date.now();
    setStreak((prev) => {
      const base = prev ?? createStreak(profileId.current!, fixtureId);
      const updated = correct ? applyCorrectAnswer(base, null) : applyWrongAnswer(base);
      // Persist
      fetch("/api/streaks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profileId.current!, fixtureId, correct, reactionMs: null }),
      }).catch(() => {});
      return updated;
    });
  }, [fixtureId]);

  const displayStatus = score?.status ?? (fixture && new Date(fixture.startDate).getTime() < Date.now() ? "finished" : "upcoming");
  const badge = statusBadge(displayStatus);
  const openChallenges = challenges.filter((c) => c.status === "OPEN");

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      {/* Back link */}
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
        ) : (
          <>
            <div className="flex items-center justify-center gap-5">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">
                  {fixture?.homeTeam.charAt(0) ?? "?"}
                </div>
                <span className="text-xs text-text-secondary">{fixture?.homeTeam ?? "Home"}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">
                  {score ? `${score.homeScore} - ${score.awayScore}` : "? - ?"}
                </span>
                {score && <span className="font-mono text-xs text-text-secondary/50">{score.minute}&apos;</span>}
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xs font-bold text-text-secondary">
                  {fixture?.awayTeam.charAt(0) ?? "?"}
                </div>
                <span className="text-xs text-text-secondary">{fixture?.awayTeam ?? "Away"}</span>
              </div>
            </div>
            {scoreStatus === "loaded" && score && (
              <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-mint">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                TxLINE data
              </div>
            )}
            {scoreStatus === "empty" && (
              <p className="mt-2 text-center text-[10px] text-text-secondary/30">
                No live data available
              </p>
            )}
          </>
        )}
      </div>

      {/* Active moment — reaction prompt */}
      {activeMoment?.reactionPrompt && profileId.current && (
        <div className="glass-elevated px-4 py-4 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-gold">{activeMoment.reactionPrompt.title}</h3>
          <p className="mb-3 text-xs text-text-secondary">{activeMoment.reactionPrompt.body}</p>
          <ReactionPanel
            eventId={activeEventId ?? "unknown"}
            fixtureId={fixtureId}
            profileId={profileId.current}
            options={activeMoment.reactionPrompt.options}
            onReacted={() => {}}
          />
        </div>
      )}

      {/* Challenge cards */}
      {openChallenges.length > 0 && profileId.current && (
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-medium text-text-secondary">Live Challenges</span>
          {openChallenges.map((ch) => (
            <ChallengeCard
              key={ch.id}
              challenge={ch}
              profileId={profileId.current!}
              onAnswered={handleAnswered}
            />
          ))}
        </div>
      )}

      {/* Resolved challenges (compact) */}
      {challenges.filter((c) => c.status !== "OPEN").length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-text-secondary">Past Challenges</span>
          {challenges
            .filter((c) => c.status !== "OPEN")
            .map((ch) => (
              <div key={ch.id} className="glass-card flex items-center gap-2 px-3 py-2">
                <span className={ch.status === "CORRECT" ? "text-mint" : "text-coral"}>
                  {ch.status === "CORRECT" ? "✓" : "✗"}
                </span>
                <span className="flex-1 text-xs text-text-secondary/70 line-clamp-1">{ch.prompt}</span>
              </div>
            ))}
        </div>
      )}

      {/* Event feed */}
      <EventFeed events={normalizedEvents} />

      {/* Streak */}
      {profileId.current && <StreakBar streak={streak} />}

      {/* Replay CTA */}
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
