"use client";

import { useState, useCallback } from "react";
import type { ReactionOption } from "@/lib/types";

interface Props {
  eventId: string;
  fixtureId: number;
  profileId: string;
  options: ReactionOption[];
  onReacted: () => void;
}

export function ReactionPanel({ eventId, fixtureId, profileId, options, onReacted }: Props) {
  const [reactedId, setReactedId] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const handleReact = useCallback(async (opt: ReactionOption) => {
    if (posting || reactedId) return;
    setPosting(true);
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          fixtureId,
          eventId,
          reactionId: opt.id,
        }),
      });
      if (res.ok) {
        setReactedId(opt.id);
        onReacted();
      }
    } catch {
      // silent
    } finally {
      setPosting(false);
    }
  }, [eventId, fixtureId, profileId, posting, reactedId, onReacted]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {options.map((opt) => {
        const isSelected = reactedId === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => handleReact(opt)}
            disabled={!!reactedId || posting}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-all active:scale-90 ${
              isSelected
                ? "bg-violet/20 text-violet ring-1 ring-violet/40"
                : reactedId
                  ? "bg-white/5 text-text-secondary/40"
                  : "bg-white/8 text-text-secondary hover:bg-white/12 hover:text-text-primary"
            }`}
          >
            <span className={isSelected ? "animate-float-up" : ""}>{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
