"use client";

import type { PulseCupEvent } from "@/lib/types";

interface Props {
  events: PulseCupEvent[];
}

const EVENT_META: Record<string, { label: string; color: string; icon: string }> = {
  GOAL: { label: "Goal", color: "text-gold", icon: "⚽" },
  YELLOW_CARD: { label: "Yellow Card", color: "text-gold", icon: "🟨" },
  RED_CARD: { label: "Red Card", color: "text-coral", icon: "🟥" },
  CORNER: { label: "Corner", color: "text-mint", icon: "⛳" },
  SUBSTITUTION: { label: "Substitution", color: "text-violet", icon: "🔄" },
  MATCH_STARTED: { label: "Kick Off", color: "text-mint", icon: "▶️" },
  MATCH_ENDED: { label: "Full Time", color: "text-coral", icon: "🏁" },
  SCORE_UPDATE: { label: "Update", color: "text-text-secondary", icon: "ℹ️" },
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

  return (
    <div className="glass-elevated px-4 py-4">
      <span className="text-[11px] font-medium text-text-secondary">Match Events</span>
      <div className="mt-3 flex flex-col gap-0">
        {events.map((evt) => {
          const meta = EVENT_META[evt.type] ?? EVENT_META.SCORE_UPDATE;
          return (
            <div
              key={evt.id}
              className="flex items-start gap-3 border-b border-white/[3%] py-2.5 last:border-0"
            >
              <span className="w-8 pt-0.5 text-right font-mono text-[11px] text-text-secondary/50">
                {evt.minute}&apos;
              </span>
              <span className="pt-0.5">{meta.icon}</span>
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
