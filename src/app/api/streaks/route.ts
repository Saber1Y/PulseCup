import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { createStreak, applyCorrectAnswer, applyWrongAnswer } from "@/lib/pulse/streak-engine";
import type { UserStreak } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET /api/streaks?profileId=&fixtureId=
export async function GET(req: Request) {
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId");
  const fixtureId = url.searchParams.get("fixtureId");

  if (!profileId || !fixtureId) {
    return NextResponse.json({ error: "profileId and fixtureId required" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    const fresh = createStreak(profileId, Number(fixtureId));
    return NextResponse.json(fresh);
  }

  const { data, error } = await supabase
    .from("streaks")
    .select("*")
    .eq("profile_id", profileId)
    .eq("fixture_id", Number(fixtureId))
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Failed to fetch streak" }, { status: 500 });
  }

  if (!data) {
    const fresh = createStreak(profileId, Number(fixtureId));
    return NextResponse.json(fresh);
  }

  return NextResponse.json(data);
}

// POST /api/streaks — update streak after challenge resolution
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profileId, fixtureId, correct, reactionMs } = body;

    if (!profileId || fixtureId === undefined || correct === undefined) {
      return NextResponse.json({ error: "profileId, fixtureId, correct required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch current streak
    const { data: existing } = await supabase
      .from("streaks")
      .select("*")
      .eq("profile_id", profileId)
      .eq("fixture_id", fixtureId)
      .maybeSingle();

    let streak: UserStreak;

    if (existing) {
      streak = {
        profileId: existing.profile_id,
        fixtureId: existing.fixture_id,
        current: existing.current_streak,
        best: existing.best_streak,
        correctCount: existing.correct_count,
        totalAnswered: existing.total_answered,
        fastestReactionMs: existing.fastest_reaction_ms,
        mood: existing.mood,
      };
    } else {
      streak = createStreak(profileId, fixtureId);
    }

    const updated = correct
      ? applyCorrectAnswer(streak, reactionMs ?? null)
      : applyWrongAnswer(streak);

    const { data, error } = await supabase
      .from("streaks")
      .upsert({
        profile_id: updated.profileId,
        fixture_id: updated.fixtureId,
        current_streak: updated.current,
        best_streak: updated.best,
        correct_count: updated.correctCount,
        total_answered: updated.totalAnswered,
        fastest_reaction_ms: updated.fastestReactionMs,
        mood: updated.mood,
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/streaks supabase error:", error);
      return NextResponse.json({ error: "Failed to update streak" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/streaks error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
