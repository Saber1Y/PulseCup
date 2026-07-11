import { NextResponse } from "next/server";
import { fetchFixtures } from "@/lib/txline/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const fixtures = await fetchFixtures();
    return NextResponse.json(fixtures);
  } catch (err) {
    console.error("GET /api/matches error:", err);
    return NextResponse.json({ error: "Failed to fetch fixtures" }, { status: 502 });
  }
}
