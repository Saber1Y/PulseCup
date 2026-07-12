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
  SHOT: [
    { id: "called-it", emoji: "🔥", label: "Close!" },
    { id: "calm", emoji: "🧊", label: "Not worried" },
  ],
  FREE_KICK: [
    { id: "called-it", emoji: "🔥", label: "Dangerous" },
    { id: "calm", emoji: "🧊", label: "Nothing yet" },
  ],
  POSSESSION: [
    { id: "calm", emoji: "🧊", label: "Still calm" },
    { id: "over", emoji: "💀", label: "Boring" },
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

const EVENT_TITLES: Record<string, string> = {
  GOAL: "Goal!",
  YELLOW_CARD: "Card shown",
  RED_CARD: "Red card!",
  CORNER: "Corner kick",
  SHOT: "Shot!",
  FREE_KICK: "Free kick",
  POSSESSION: "Possession",
  MATCH_ENDED: "Full time",
};

const EVENT_BODIES: Record<string, string> = {
  GOAL: "How are you reacting to that finish?",
  YELLOW_CARD: "What's your read on the match now?",
  RED_CARD: "Huge moment. Your reaction?",
  CORNER: "Big chance brewing. Your take?",
  SHOT: "Close to a goal. How are you feeling?",
  FREE_KICK: "Dangerous set piece. Your call?",
  POSSESSION: "Match settling down. Your vibe?",
};

export function createMomentFromEvent(
  event: PulseCupEvent,
): GeneratedMoment {
  const reactionOptions = EVENT_OPTIONS_MAP[event.type] ?? REACTION_OPTIONS;

  const reactionPrompt = {
    title: EVENT_TITLES[event.type] ?? "Match update",
    body: EVENT_BODIES[event.type] ?? "React to the latest moment.",
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
