"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IoStatsChart, IoWalletOutline } from "react-icons/io5";
import { TeamWithFlag } from "@/lib/flags";
import { getGuestProfileId } from "@/lib/guest";
import { useWallet } from "@solana/wallet-adapter-react";
import type { RecapCard } from "@/lib/types";

export default function ProfilePage() {
  const [recaps, setRecaps] = useState<RecapCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { publicKey, connected, connect, disconnect, connecting, wallet } = useWallet();

  const profileId = connected && publicKey ? publicKey.toBase58() : getGuestProfileId();

  useEffect(() => {
    fetch(`/api/recaps?profileId=${profileId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setRecaps(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  const displayName = connected && publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "Guest Fan";

  const displayInitial = connected && publicKey
    ? publicKey.toBase58().charAt(0).toUpperCase()
    : "G";

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral/30 to-violet/30 text-xl">
          <span className="font-bold text-text-primary">{displayInitial}</span>
        </div>
        <div>
          <h1 className="text-lg font-bold">{displayName}</h1>
          <p className="text-xs text-text-secondary">
            {recaps.length > 0
              ? `${recaps.length} recap${recaps.length > 1 ? "s" : ""}`
              : "No matches watched yet."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass-elevated px-4 py-8 text-center">
          <p className="text-sm text-text-secondary/50">Loading...</p>
        </div>
      ) : recaps.length > 0 ? (
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-medium text-text-secondary">Recap Cards</span>
          {recaps.map((r) => (
            <Link
              key={r.id}
              href={`/app/share/${r.id}`}
              className="glass-elevated flex items-center justify-between px-4 py-3 transition-all hover:border-coral/20"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-text-primary">
                  <TeamWithFlag name={r.homeTeam} /> {r.homeScore} - {r.awayScore} <TeamWithFlag name={r.awayTeam} />
                </span>
                <span className="text-[10px] text-text-secondary/50">
                  {r.mood} · {r.correctCalls} correct · Best streak {r.bestStreak}
                </span>
              </div>
              <span className="text-xs text-coral">View →</span>
            </Link>
          ))}
        </div>
      ) : (
        <>
          <div className="glass-elevated px-4 py-8 text-center">
            <IoStatsChart className="mx-auto text-3xl text-text-secondary/40" />
            <p className="mt-3 text-sm text-text-secondary">No stats yet</p>
            <p className="mt-1 text-xs text-text-secondary/50">
              Stats appear after you watch a match and answer challenges.
            </p>
            <Link
              href="/app/matches"
              className="mt-4 inline-block rounded-lg bg-coral px-5 py-2.5 text-xs font-semibold text-white"
            >
              Find a Match
            </Link>
          </div>

          <div className="glass-elevated px-4 py-4">
            <span className="text-[11px] font-medium text-text-secondary">Recap Cards</span>
            <p className="mt-2 text-xs text-text-secondary/50">
              Recap cards are generated after watching a match.
            </p>
          </div>
        </>
      )}

      <div className="mb-8 rounded-xl border border-border bg-surface/50 px-4 py-4 text-center">
        {connected ? (
          <>
            <IoWalletOutline className="mx-auto text-xl text-violet" />
            <p className="mt-2 text-xs text-text-secondary">
              Connected as{" "}
              <span className="font-mono text-violet">
                {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-4)}
              </span>
            </p>
            <p className="mt-0.5 text-[10px] text-text-secondary/50">{wallet?.adapter.name}</p>
            <button
              onClick={disconnect}
              className="mt-3 cursor-pointer rounded-lg border border-coral/30 bg-coral/5 px-4 py-2 text-xs font-medium text-coral transition-all hover:bg-coral/10"
            >
              Disconnect
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-text-secondary">
              Connect wallet to save your pulse across devices.
            </p>
            <button
              onClick={connect}
              disabled={connecting}
              className="mt-2 cursor-pointer rounded-lg border border-violet/30 bg-violet/5 px-4 py-2 text-xs font-medium text-violet transition-all hover:bg-violet/10 disabled:opacity-50"
            >
              {connecting ? "Connecting..." : "Connect Solana Wallet"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
