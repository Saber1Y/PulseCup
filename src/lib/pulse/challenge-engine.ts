import type { PulseCupEvent, Challenge, ChallengeType, ChallengeStatus } from "../types";

const GOAL_EVENTS = new Set(["GOAL"]);
const MAJOR_EVENTS = new Set(["GOAL", "YELLOW_CARD", "RED_CARD"]);

let localCounter = 0;

function nextId(): string {
  localCounter++;
  return `ch-${Date.now()}-${localCounter}`;
}

function optionIndexForTeam(team: "HOME" | "AWAY"): number {
  return team === "HOME" ? 0 : 1;
}

export function createChallenge(
  type: ChallengeType,
  prompt: string,
  options: string[],
  triggerEvent: PulseCupEvent,
): Challenge {
  return {
    id: nextId(),
    fixtureId: triggerEvent.fixtureId,
    type,
    prompt,
    options,
    status: "OPEN",
    correctOptionIndex: null,
    triggerEventId: triggerEvent.id,
    createdByEventId: triggerEvent.id,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };
}

export function resolveChallenge(
  challenge: Challenge,
  event: PulseCupEvent,
): Challenge | null {
  if (challenge.status !== "OPEN") return null;

  const totalGoals = event.homeScore + event.awayScore;

  switch (challenge.type) {
    case "NEXT_GOAL": {
      if (GOAL_EVENTS.has(event.type)) {
        return {
          ...challenge,
          status: "CORRECT",
          correctOptionIndex: optionIndexForTeam(event.team ?? "HOME"),
          resolvedAt: new Date().toISOString(),
        };
      }
      // Match ended without a next goal — user's pick was wrong
      if (event.type === "MATCH_ENDED" && challenge.selectedOptionIndex != null) {
        return {
          ...challenge,
          status: "WRONG",
          correctOptionIndex: challenge.selectedOptionIndex === 0 ? 1 : 0,
          resolvedAt: new Date().toISOString(),
        };
      }
      return null;
    }

    case "TOTAL_GOALS_REACH_3": {
      if (totalGoals >= 3 || event.type === "MATCH_ENDED") {
        return {
          ...challenge,
          status: totalGoals >= 3 ? "CORRECT" : "WRONG",
          correctOptionIndex: totalGoals >= 3 ? 0 : 1,
          resolvedAt: new Date().toISOString(),
        };
      }
      return null;
    }

    case "NEXT_MAJOR_EVENT": {
      if (MAJOR_EVENTS.has(event.type)) {
        return {
          ...challenge,
          status: "CORRECT",
          correctOptionIndex: 0,
          resolvedAt: new Date().toISOString(),
        };
      }
      // Match ended without the predicted major event
      if (event.type === "MATCH_ENDED") {
        return {
          ...challenge,
          status: "WRONG",
          correctOptionIndex: 1,
          resolvedAt: new Date().toISOString(),
        };
      }
      return null;
    }

    default:
      return null;
  }
}

export function findOpenChallenges(
  challenges: Challenge[],
  fixtureId: number,
): Challenge[] {
  return challenges.filter(
    (c) => c.fixtureId === fixtureId && c.status === "OPEN",
  );
}
