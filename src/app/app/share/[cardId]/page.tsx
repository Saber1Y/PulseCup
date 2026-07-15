"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { RecapCard } from "@/lib/types";
import { IoFlash, IoImageOutline } from "react-icons/io5";
import { TeamWithFlag } from "@/lib/flags";

export default function ShareCardPage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const [card, setCard] = useState<RecapCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cardId) return;
    fetch(`/api/recaps?cardId=${encodeURIComponent(cardId)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCard(data[0]);
        } else {
          // Fallback to localStorage
          try {
            const stored = localStorage.getItem(`recap-${cardId}`);
            if (stored) setCard(JSON.parse(stored));
          } catch {}
        }
      })
      .catch(() => {
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem(`recap-${cardId}`);
          if (stored) setCard(JSON.parse(stored));
        } catch {}
      })
      .finally(() => setLoading(false));
  }, [cardId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-6">
        <Link href="/app/matches" className="text-xs text-text-secondary/60 hover:text-text-primary">
          ← Matches
        </Link>
        <p className="text-sm text-text-secondary/50">Loading recap...</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-6">
        <Link href="/app/matches" className="text-xs text-text-secondary/60 hover:text-text-primary">
          ← Matches
        </Link>
        <h1 className="text-lg font-bold">Match Recap</h1>
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-coral/20 via-violet/20 to-gold/10 p-[1px]">
          <div className="rounded-2xl bg-bg-deep px-6 py-8 text-center">
            <IoImageOutline className="mx-auto text-2xl text-text-secondary/40" />
            <p className="mt-3 text-sm text-text-secondary">Recap cards are generated after each match</p>
            <p className="mt-1 text-xs text-text-secondary/50">
              Shareable recap cards will appear here with your streaks, reactions, and match stats.
            </p>
            <Link
              href="/app/matches"
              className="mt-4 inline-block rounded-lg bg-coral/20 px-4 py-2 text-xs font-semibold text-coral transition-all hover:bg-coral/30"
            >
              Play a match
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <Link href="/app/matches" className="text-xs text-text-secondary/60 hover:text-text-primary">
        ← Matches
      </Link>
      <h1 className="text-lg font-bold">Match Recap</h1>

      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-coral/20 via-violet/20 to-gold/10 p-[1px]">
        <div className="rounded-2xl bg-bg-deep px-6 py-8 text-center">
          <IoFlash className="mx-auto text-3xl text-gold" />
          <p className="mt-2 text-lg font-bold text-text-primary">
            <TeamWithFlag name={card.homeTeam} /> {card.homeScore} - {card.awayScore} <TeamWithFlag name={card.awayTeam} />
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/[4%] px-3 py-3">
              <span className="text-2xl font-bold text-gold">{card.correctCalls}</span>
              <p className="text-[10px] text-text-secondary/50">Correct calls</p>
            </div>
            <div className="rounded-xl bg-white/[4%] px-3 py-3">
              <span className="text-2xl font-bold text-violet">{card.bestStreak}</span>
              <p className="text-[10px] text-text-secondary/50">Best streak</p>
            </div>
            <div className="rounded-xl bg-white/[4%] px-3 py-3">
              <span className="text-2xl font-bold text-mint">{card.fastestReaction}</span>
              <p className="text-[10px] text-text-secondary/50">Fastest</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-white/[4%] px-4 py-3">
            <p className="text-xs text-text-secondary/50">Mood</p>
            <p className="text-lg font-semibold text-gold">{card.mood}</p>
          </div>

          <div className="mt-4 rounded-xl bg-white/[4%] px-4 py-3">
            <p className="text-xs text-text-secondary/50">Total reactions</p>
            <p className="text-lg font-semibold text-text-primary">{card.totalReactions}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-text-secondary transition-all hover:bg-white/[4%]"
        >
          Copy link
        </button>
        <Link
          href="/app/matches"
          className="flex-1 rounded-lg bg-coral px-4 py-2.5 text-center text-xs font-semibold text-white"
        >
          Next match
        </Link>
      </div>
    </div>
  );
}
