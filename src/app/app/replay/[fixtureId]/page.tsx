"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PulseCupEvent, GeneratedMoment, Challenge, UserStreak, UserReaction, RecapCard, TxLINEFixture } from "@/lib/types";
import { normalizeTxLINEArray } from "@/lib/txline/normalize-event";
import { createMomentFromEvent } from "@/lib/pulse/moment-engine";
import { createChallenge, resolveChallenge } from "@/lib/pulse/challenge-engine";
import { createStreak, applyCorrectAnswer, applyWrongAnswer } from "@/lib/pulse/streak-engine";
import { generateRecap } from "@/lib/pulse/recap-engine";
import { getGuestProfileId } from "@/lib/guest";
import { ReactionPanel } from "@/components/live/ReactionPanel";
import { ChallengeCard } from "@/components/live/ChallengeCard";
import { EventFeed } from "@/components/live/EventFeed";
import { StreakBar } from "@/components/live/StreakBar";
import { IoMailOpenOutline, IoPlaySharp, IoPauseSharp, IoReloadOutline, IoTrophyOutline } from "react-icons/io5";
import { teamFlag, TeamWithFlag } from "@/lib/flags";

export default function ReplayPage() {
  const params = useParams();
  const fixtureId = Number(params.fixtureId);
  const profileId = useRef<string | null>(null);

  const [fetchStatus, setFetchStatus] = useState<"loading" | "loaded" | "empty">("loading");
  const [fixture, setFixture] = useState<TxLINEFixture | null>(null);
  const [allEvents, setAllEvents] = useState<PulseCupEvent[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<PulseCupEvent[]>([]);
  const [activeMoment, setActiveMoment] = useState<GeneratedMoment | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [recapCard, setRecapCard] = useState<RecapCard | null>(null);

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [eventIdx, setEventIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const createdChallengeKeys = useRef<Set<string>>(new Set());
  const sessionReactions = useRef<UserReaction[]>([]);
  const lastEventRef = useRef<PulseCupEvent | null>(null);
  const pendingAutoResume = useRef(false);

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

  // Fetch snapshot events
  useEffect(() => {
    setFetchStatus("loading");
    fetch(`/api/scores/${fixtureId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((raw) => {
        const normalized = normalizeTxLINEArray(raw).filter(
          (e) => e.type !== "OTHER",
        );
        // TxLINE emits multiple MATCH_ENDED events (regular time, extra time periods).
        // Keep only the last one so the replay doesn't show "Full time" prematurely.
        const sorted = [...normalized].sort((a, b) => a.txlineSequence - b.txlineSequence);
        const lastMatchEnded = sorted
          .map((e, i) => (e.type === "MATCH_ENDED" ? i : -1))
          .filter((i) => i >= 0)
          .pop();
        const cleaned = sorted.filter(
          (e, i) => e.type !== "MATCH_ENDED" || i === lastMatchEnded,
        );
        if (cleaned.length > 0) {
          setAllEvents(cleaned);
          setFetchStatus("loaded");
        } else {
          setFetchStatus("empty");
        }
      })
      .catch(() => setFetchStatus("empty"));
  }, [fixtureId]);

  // Advance to next event
  const advance = useCallback(() => {
    setEventIdx((prev) => {
      const next = prev + 1;
      if (next >= allEvents.length) {
        setPlaying(false);
        setCompleted(true);
        return prev;
      }
      return next;
    });
  }, [allEvents.length]);

  const pendingChallenges = challenges.filter(
    (c) => c.status === "OPEN" && c.selectedOptionIndex === undefined,
  );
  const openChallenges = challenges.filter((c) => c.status === "OPEN");

  // Timer loop
  useEffect(() => {
    if (!playing || completed || allEvents.length === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    // Pause when user has unanswered challenges
    if (pendingChallenges.length > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const delay = 3000 / speed;
    timerRef.current = setTimeout(advance, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, eventIdx, speed, completed, advance, allEvents.length, pendingChallenges.length]);

  // Process event when index changes
  useEffect(() => {
    if (eventIdx < 0 || eventIdx >= allEvents.length) return;
    const evt = allEvents[eventIdx];

    setVisibleEvents((prev) => {
      if (prev.some((e) => e.id === evt.id)) return prev;
      return [...prev, evt];
    });

    // Run moment engine
    const moment = createMomentFromEvent(evt);
    setActiveMoment(moment);
    setActiveEventId(evt.id);

    // Generate challenge (only one open per type)
    if (moment.challenge) {
      const type = moment.challenge.type;
      const alreadyOpen = createdChallengeKeys.current.has(`${evt.fixtureId}-${type}`);
      if (!alreadyOpen) {
        createdChallengeKeys.current.add(`${evt.fixtureId}-${type}`);
        const ch = createChallenge(
          type,
          moment.challenge.prompt,
          moment.challenge.options,
          evt,
        );
        setChallenges((prev) => [...prev, ch]);
        setPlaying(false); // Auto-pause
        pendingAutoResume.current = true;
      }
    }

    // Resolve answered challenges
    const resolvedOutcome: boolean[] = [];
    setChallenges((prev) => {
      let updated = [...prev];
      for (const ch of updated) {
        if (ch.status !== "OPEN" || ch.selectedOptionIndex === undefined) continue;
        const resolved = resolveChallenge(ch, evt);
        if (resolved) {
          const isCorrect = ch.selectedOptionIndex === resolved.correctOptionIndex;
          updated = updated.map((c) => (c.id === resolved.id ? resolved : c));
          resolvedOutcome.push(isCorrect);
        }
      }
      return updated;
    });
    for (const correct of resolvedOutcome) {
      handleAnswered(correct);
    }

    lastEventRef.current = evt;
  }, [eventIdx, allEvents]);

  // Generate recap when replay completes
  useEffect(() => {
    if (!completed || !profileId.current || !fixture || !lastEventRef.current) return;
    const currentStreak = streak ?? createStreak(profileId.current, fixtureId);
    const entries = challenges
      .filter((c) => c.status !== "OPEN")
      .map((c) => ({
        id: `entry-${profileId.current}-${c.id}`,
        profileId: profileId.current!,
        challengeId: c.id,
        selectedOption: c.correctOptionIndex ?? 0,
        createdAt: c.resolvedAt ?? new Date().toISOString(),
      }));
    const recap = generateRecap({
      profileId: profileId.current,
      fixtureId,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      finalEvent: lastEventRef.current,
      reactions: sessionReactions.current,
      challenges,
      entries,
      streak: currentStreak,
    });
    setRecapCard(recap);
    // Save to localStorage so share page works without Supabase
    try {
      localStorage.setItem(`recap-${recap.id}`, JSON.stringify(recap));
    } catch {}
    fetch("/api/recaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recap),
    }).catch(() => {});
  }, [completed]);

  function handlePlay() {
    if (completed) {
      setCompleted(false);
      setEventIdx(-1);
      setVisibleEvents([]);
      setChallenges([]);
      setStreak(null);
      setRecapCard(null);
      setActiveMoment(null);
      createdChallengeKeys.current.clear();
      sessionReactions.current = [];
      lastEventRef.current = null;
    }
    setPlaying(true);
  }
  function handlePause() { setPlaying(false); }
  function handleRestart() {
    setPlaying(false);
    setCompleted(false);
    setEventIdx(-1);
    setVisibleEvents([]);
    setChallenges([]);
    setStreak(null);
    setRecapCard(null);
    setActiveMoment(null);
    createdChallengeKeys.current.clear();
    sessionReactions.current = [];
    lastEventRef.current = null;
  }

  const currentEvent = eventIdx >= 0 && eventIdx < allEvents.length ? allEvents[eventIdx] : null;

  // Auto-resume when all pending challenges are answered
  useEffect(() => {
    if (pendingAutoResume.current && pendingChallenges.length === 0) {
      pendingAutoResume.current = false;
      setPlaying(true);
    }
  }, [pendingChallenges.length]);

  const handleAnswered = useCallback((correct: boolean | null) => {
    if (!profileId.current || correct === null) return;
    setStreak((prev) => {
      const base = prev ?? createStreak(profileId.current!, fixtureId);
      return correct ? applyCorrectAnswer(base, null) : applyWrongAnswer(base);
    });
  }, [fixtureId]);

  const handleChallengeAnswer = useCallback((challengeId: string, optionIndex: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, selectedOptionIndex: optionIndex } : c)),
    );
    // Auto-resume effect will pick up once this challenge is no longer pending
  }, []);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <Link href="/app/matches" className="text-xs text-text-secondary/60 hover:text-text-primary">
        ← Matches
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">
          {fixture ? <><TeamWithFlag name={fixture.homeTeam} /> vs <TeamWithFlag name={fixture.awayTeam} /></> : "Replay Mode"}
        </h1>
        <span className="rounded-full border border-violet/30 bg-violet/5 px-2.5 py-0.5 text-[10px] font-medium text-violet">
          REPLAY
        </span>
      </div>

      {fetchStatus === "loading" && (
        <p className="text-xs text-text-secondary/50">Loading replay data from TxLINE...</p>
      )}

      {fetchStatus === "empty" && (
        <div className="glass-elevated px-4 py-8 text-center">
          <IoMailOpenOutline className="mx-auto text-2xl text-text-secondary/40" />
          <p className="mt-2 text-sm text-text-secondary">No replay data for this fixture</p>
          <p className="mt-1 text-xs text-text-secondary/50">
            The snapshot endpoint returned no match events for fixture {fixtureId}.
          </p>
          <Link
            href="/app/matches"
            className="mt-4 inline-block rounded-lg bg-coral/20 px-4 py-2 text-xs font-semibold text-coral transition-all hover:bg-coral/30"
          >
            Back to Matches
          </Link>
        </div>
      )}

      {fetchStatus === "loaded" && allEvents.length > 0 && (
        <>
          <p className="text-xs leading-relaxed text-text-secondary">
            Replaying {allEvents.length} real TxLINE events for {fixture?.homeTeam ?? "Home"} vs {fixture?.awayTeam ?? "Away"}.
          </p>

          {/* Scoreboard + Controls */}
          <div className="glass-elevated px-4 py-4">
            <div className="flex items-center justify-center gap-5">
              <TeamWithFlag name={fixture?.homeTeam ?? "Home"} className="text-sm text-text-secondary" />
              <span className="text-3xl font-bold">
                {currentEvent?.homeScore ?? 0} - {currentEvent?.awayScore ?? 0}
              </span>
              <TeamWithFlag name={fixture?.awayTeam ?? "Away"} className="text-sm text-text-secondary" />
            </div>
            <div className="mt-2 text-center font-mono text-xs text-text-secondary/50">
              {currentEvent?.type === "MATCH_ENDED" ? "FT" : `${currentEvent?.minute ?? 0}'`}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={handlePlay} disabled={playing || completed}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-coral/20 text-xs text-coral transition-all hover:bg-coral/30 disabled:opacity-30"><IoPlaySharp /></button>
                <button onClick={handlePause} disabled={!playing}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface text-xs text-text-secondary transition-all hover:bg-elevated disabled:opacity-30"><IoPauseSharp /></button>
                <button onClick={handleRestart}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface text-xs text-text-secondary transition-all hover:bg-elevated"><IoReloadOutline /></button>
              </div>
              <div className="flex items-center gap-1">
                {[2, 4, 8, 16].map((s) => (
                  <button key={s} onClick={() => setSpeed(s)}
                    className={`cursor-pointer rounded-md px-2 py-1 text-[10px] font-mono transition-all ${speed === s ? "bg-coral/15 text-coral" : "text-text-secondary/40 hover:bg-surface hover:text-text-secondary"}`}>{s}x</button>
                ))}
              </div>
            </div>
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
                onReacted={() => {
                  if (profileId.current && activeEventId) {
                    sessionReactions.current.push({
                      id: `react-${Date.now()}`,
                      fixtureId,
                      profileId: profileId.current,
                      reactionId: "called-it",
                      eventId: activeEventId,
                      createdAt: new Date().toISOString(),
                    });
                  }
                }}
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
                  onChallengeAnswer={handleChallengeAnswer}
                />
              ))}
            </div>
          )}

          {/* Past challenges */}
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
          <EventFeed events={visibleEvents} />

          {/* Streak */}
          {profileId.current && <StreakBar streak={streak} />}

          {/* Progress */}
          <div className="glass-elevated px-4 py-3">
            <div className="flex items-center justify-between text-[10px] text-text-secondary/50">
              <span>Event {eventIdx + 1} of {allEvents.length}</span>
              <span>{Math.round(((eventIdx + 1) / allEvents.length) * 100)}%</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-elevated">
              <div className="h-1 rounded-full bg-coral transition-all duration-300"
                style={{ width: `${((eventIdx + 1) / allEvents.length) * 100}%` }} />
            </div>
          </div>

          {/* Completed — recap card */}
          {completed && (
            <div className="mb-8 flex flex-col gap-4">
              <div className="glass-elevated border border-gold/20 px-4 py-6 text-center">
                <IoTrophyOutline className="mx-auto text-2xl text-gold" />
                <p className="mt-2 text-sm font-semibold text-gold">Replay Complete</p>
                <p className="mt-1 text-xs text-text-secondary/60">{allEvents.length} events replayed</p>
              </div>

              {recapCard && (
                <div className="glass-elevated animate-fade-in-up px-4 py-4 text-center">
                  <span className="text-[11px] font-medium text-text-secondary">Your Match Pulse</span>
                  <p className="mt-1 text-sm font-bold text-text-primary">
                    {recapCard.homeTeam} {recapCard.homeScore} - {recapCard.awayScore} {recapCard.awayTeam}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white/[4%] px-2 py-2">
                      <span className="text-lg font-bold text-gold">{recapCard.correctCalls}</span>
                      <p className="text-[9px] text-text-secondary/50">Correct</p>
                    </div>
                    <div className="rounded-lg bg-white/[4%] px-2 py-2">
                      <span className="text-lg font-bold text-violet">{recapCard.bestStreak}</span>
                      <p className="text-[9px] text-text-secondary/50">Best streak</p>
                    </div>
                    <div className="rounded-lg bg-white/[4%] px-2 py-2">
                      <span className="text-lg font-bold text-mint">{recapCard.fastestReaction}</span>
                      <p className="text-[9px] text-text-secondary/50">Fastest</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gold font-medium">{recapCard.mood}</div>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/app/share/${recapCard.id}`;
                      if (navigator.share) {
                        navigator.share({ title: "Match Recap", url }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(url).then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }).catch(() => {});
                      }
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-coral/15 px-4 py-2 text-xs font-medium text-coral transition-all hover:bg-coral/25"
                  >
                    {copied ? "Link copied!" : "Share recap"}
                  </button>
                </div>
              )}

              <button onClick={handlePlay}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-coral/20 px-4 py-2.5 text-xs font-semibold text-coral transition-all hover:bg-coral/30"><IoReloadOutline /> Replay</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
