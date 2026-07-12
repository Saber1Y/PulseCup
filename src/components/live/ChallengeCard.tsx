"use client";

import { useState, useCallback } from "react";
import type { Challenge } from "@/lib/types";

interface Props {
  challenge: Challenge;
  profileId: string;
  onAnswered: (correct: boolean) => void;
}

export function ChallengeCard({ challenge, profileId, onAnswered }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [resolved, setResolved] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [posting, setPosting] = useState(false);

  const handleSelect = useCallback(async (index: number) => {
    if (posting || selected !== null) return;
    setPosting(true);
    setSelected(index);
    try {
      const res = await fetch("/api/challenges/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, challengeId: challenge.id, selectedOption: index }),
      });
      if (res.ok) {
        const data = await res.json();
        setResolved(data.resolved);
        setCorrect(data.correct);
        onAnswered(data.correct);
      }
    } catch {
      // silent
    } finally {
      setPosting(false);
    }
  }, [challenge.id, profileId, posting, selected, onAnswered]);

  return (
    <div className="glass-elevated px-4 py-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-violet/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-violet">
          {challenge.type.replace(/_/g, " ")}
        </span>
      </div>
      <p className="text-sm font-medium text-text-primary">{challenge.prompt}</p>

      <div className="mt-3 flex flex-col gap-2">
        {challenge.options.map((opt, i) => {
          let cls = "bg-white/6 text-text-secondary";
          if (selected !== null && resolved) {
            if (i === challenge.correctOptionIndex) {
              cls = "bg-mint/10 text-mint ring-1 ring-mint/40";
            } else if (i === selected && correct === false) {
              cls = "bg-coral/10 text-coral ring-1 ring-coral/40";
            }
          } else if (selected === i) {
            cls = "bg-violet/20 text-violet ring-1 ring-violet/40";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all active:scale-[0.98] ${cls}`}
            >
              <span className="text-left leading-snug">{opt}</span>
              {selected !== null && resolved && i === challenge.correctOptionIndex && (
                <span className="text-mint">✓</span>
              )}
              {selected === i && resolved && correct === false && (
                <span className="text-coral">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {resolved && (
        <p className={`mt-2 text-[11px] font-medium ${correct ? "text-mint" : "text-coral"}`}>
          {correct ? "Correct!" : "Wrong answer"}
        </p>
      )}
    </div>
  );
}
