import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST /api/challenges — resolve a challenge
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fixtureId, challengeId, answer, sessionId } = body;

    if (!fixtureId || !challengeId || answer === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // TODO: check answer against stored challenge, update streak in Supabase
    console.log("Challenge answered:", { fixtureId, challengeId, answer, sessionId });

    return NextResponse.json({ correct: true, streak: 1 });
  } catch (err) {
    console.error("POST /api/challenges error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
