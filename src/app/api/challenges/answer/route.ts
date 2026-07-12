import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Challenge } from "@/lib/types";

export const dynamic = "force-dynamic";

// POST /api/challenges/answer — submit an answer to a challenge
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profileId, challengeId, selectedOption } = body;

    if (!profileId || !challengeId || selectedOption === undefined) {
      return NextResponse.json(
        { error: "profileId, challengeId, selectedOption required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    // Check if already answered
    const { data: existing } = await supabase
      .from("challenge_entries")
      .select("id")
      .eq("profile_id", profileId)
      .eq("challenge_id", challengeId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Already answered" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("challenge_entries")
      .insert({
        profile_id: profileId,
        challenge_id: challengeId,
        selected_option: selectedOption,
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/challenges/answer supabase error:", error);
      return NextResponse.json({ error: "Failed to store answer" }, { status: 500 });
    }

    // Fetch the challenge to check correctness
    const { data: challenge } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", challengeId)
      .single();

    const isResolved = challenge?.status === "CORRECT" || challenge?.status === "WRONG";
    const isCorrect = challenge?.correct_option_index === selectedOption;

    return NextResponse.json({
      ...data,
      resolved: isResolved,
      correct: isResolved ? isCorrect : null,
    });
  } catch (err) {
    console.error("POST /api/challenges/answer error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
