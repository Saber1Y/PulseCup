"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShareCardPage() {
  const params = useParams();
  const cardId = params.cardId;

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <Link href="/app/matches" className="text-xs text-text-secondary/60 hover:text-text-primary">
        ← Matches
      </Link>
      <h1 className="text-lg font-bold">Match Recap</h1>

      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-coral/20 via-violet/20 to-gold/10 p-[1px]">
        <div className="rounded-2xl bg-bg-deep px-6 py-8 text-center">
          <span className="text-2xl">🖼️</span>
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
