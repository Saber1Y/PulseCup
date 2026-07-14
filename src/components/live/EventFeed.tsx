"use client";

import type { PulseCupEvent } from "@/lib/types";
import { IoFootball, IoFlagOutline, IoSwapHorizontalOutline, IoPlayCircleOutline, IoStopCircleOutline, IoInformationCircleOutline } from "react-icons/io5";

interface Props {
  events: PulseCupEvent[];
}

function EventIcon({ type }: { type: string }) {
  switch (type) {
    case "GOAL":
      return <IoFootball className="text-gold" />;
    case "YELLOW_CARD":
      return <span className="inline-block h-3 w-2 rounded-[2px] bg-yellow-400" />;
    case "RED_CARD":
      return <span className="inline-block h-3 w-2 rounded-[2px] bg-red-500" />;
    case "CORNER":
      return <IoFlagOutline className="text-mint" />;
    case "SUBSTITUTION":
      return <IoSwapHorizontalOutline className="text-violet" />;
    case "MATCH_STARTED":
      return <IoPlayCircleOutline className="text-mint" />;
    case "MATCH_ENDED":
      return <IoStopCircleOutline className="text-coral" />;
    default:
      return <IoInformationCircleOutline className="text-text-secondary/50" />;
  }
}

const EVENT_META: Record<string, { label: string; color: string }> = {
  GOAL: { label: "Goal", color: "text-gold" },
  YELLOW_CARD: { label: "Yellow Card", color: "text-yellow-400" },
  RED_CARD: { label: "Red Card", color: "text-red-500" },
  CORNER: { label: "Corner", color: "text-mint" },
  SUBSTITUTION: { label: "Substitution", color: "text-violet" },
  MATCH_STARTED: { label: "Kick Off", color: "text-mint" },
  MATCH_ENDED: { label: "Full Time", color: "text-coral" },
  SCORE_UPDATE: { label: "Update", color: "text-text-secondary" },
};

export function EventFeed({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="glass-elevated px-4 py-4">
        <span className="text-[11px] font-medium text-text-secondary">Match Events</span>
        <p className="mt-1 text-xs text-text-secondary/50">
          No events yet for this fixture.
        </p>
      </div>
    );
  }

  const sorted = [...events].sort((a, b) => a.txlineSequence - b.txlineSequence);

  return (
    <div className="glass-elevated px-4 py-4">
      <span className="text-[11px] font-medium text-text-secondary">Match Events</span>
      <div className="mt-3 flex flex-col gap-0">
        {sorted.map((evt) => {
          const meta = EVENT_META[evt.type] ?? EVENT_META.SCORE_UPDATE;
          return (
            <div
              key={evt.id}
              className="flex items-start gap-3 border-b border-white/[3%] py-2.5 last:border-0"
            >
              <span className="w-8 pt-0.5 text-right font-mono text-[11px] text-text-secondary/50">
                {evt.minute}&apos;
              </span>
              <span className="pt-0.5 text-sm"><EventIcon type={evt.type} /></span>
              <div className="flex-1">
                <span className={`text-sm font-medium ${meta.color}`}>{meta.label}</span>
                {evt.team && (
                  <span className="ml-1.5 text-xs text-text-secondary/60">
                    {evt.team === "HOME" ? "(Home)" : "(Away)"}
                  </span>
                )}
                <div className="text-[11px] text-text-secondary/40">
                  {evt.homeScore} - {evt.awayScore}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
