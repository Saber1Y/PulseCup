import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST /api/reactions — record a reaction
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fixtureId, reactionType, sessionId } = body;

    if (!fixtureId || !reactionType) {
      return NextResponse.json({ error: "fixtureId and reactionType required" }, { status: 400 });
    }

    // TODO: persist to Supabase
    console.log("Reaction recorded:", { fixtureId, reactionType, sessionId });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/reactions error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
