import type {
  PulseCupEvent,
  GeneratedMoment,
  ReactionOption,
} from "../types";

const REACTION_OPTIONS: ReactionOption[] = [
  { id: "called-it", emoji: "🔥", label: "Called it" },
  { id: "shocked", emoji: "😱", label: "Shocked" },
  { id: "over", emoji: "💀", label: "It's over" },
  { id: "calm", emoji: "🧊", label: "Still calm" },
];

const EVENT_OPTIONS_MAP: Partial<Record<string, ReactionOption[]>> = {
  GOAL: REACTION_OPTIONS,
  YELLOW_CARD: [
    { id: "called-it", emoji: "🔥", label: "Called it" },
    { id: "shocked", emoji: "😱", label: "Heating up" },
    { id: "calm", emoji: "🧊", label: "Still calm" },
  ],
  RED_CARD: [
    { id: "shocked", emoji: "😱", label: "Shocked" },
    { id: "over", emoji: "💀", label: "Game changed" },
  ],
  CORNER: [
    { id: "called-it", emoji: "🔥", label: "Dangerous" },
    { id: "calm", emoji: "🧊", label: "Nothing yet" },
  ],
};

const CHALLENGE_RULES: Array<{
  type: string;
  condition: (event: PulseCupEvent) => boolean;
  prompt: (event: PulseCupEvent) => string;
  options: () => string[];
}> = [
  {
    type: "NEXT_GOAL",
    condition: (e) => e.type === "GOAL",
    prompt: () => "Which team scores the next goal?",
    options: () => ["HOME", "AWAY"],
  },
  {
    type: "TOTAL_GOALS_REACH_3",
    condition: (e) =>
      e.type === "GOAL" && e.homeScore + e.awayScore < 3,
    prompt: () => "Will this match reach 3 total goals?",
    options: () => ["Yes", "No"],
  },
  {
    type: "NEXT_MAJOR_EVENT",
    condition: (e) =>
      ["GOAL", "YELLOW_CARD", "RED_CARD"].includes(e.type),
    prompt: (e) =>
      e.type === "GOAL"
        ? "Will there be another goal in the next 10 minutes?"
        : "Will there be a card in the next 10 minutes?",
    options: () => ["Yes", "No"],
  },
];

export function createMomentFromEvent(
  event: PulseCupEvent,
): GeneratedMoment {
  const reactionOptions = EVENT_OPTIONS_MAP[event.type] ?? REACTION_OPTIONS;

  const reactionPrompt = {
    title:
      event.type === "GOAL"
        ? "Goal!"
        : event.type === "YELLOW_CARD"
          ? "Card shown"
          : event.type === "RED_CARD"
            ? "Red card!"
            : event.type === "CORNER"
              ? "Corner kick"
              : "Match update",
    body:
      event.type === "GOAL"
        ? "How are you reacting to that finish?"
        : event.type === "YELLOW_CARD"
          ? "What's your read on the match now?"
          : event.type === "RED_CARD"
            ? "Huge moment. Your reaction?"
            : event.type === "CORNER"
              ? "Big chance brewing. Your take?"
              : "React to the latest moment.",
    options: reactionOptions,
  };

  const matchingRule = CHALLENGE_RULES.find((r) =>
    r.condition(event),
  );

  const challenge = matchingRule
    ? {
        type: matchingRule.type as "NEXT_GOAL" | "TOTAL_GOALS_REACH_3" | "NEXT_MAJOR_EVENT",
        prompt: matchingRule.prompt(event),
        options: matchingRule.options(),
      }
    : null;

  return { reactionPrompt, challenge };
}

export function getReactionOptions(): ReactionOption[] {
  return REACTION_OPTIONS;
}
