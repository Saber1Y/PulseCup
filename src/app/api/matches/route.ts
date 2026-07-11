import { NextResponse } from "next/server";
import WC26_FIXTURES from "@/lib/wc26-fixtures";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(WC26_FIXTURES);
  } catch (err) {
    console.error("GET /api/matches error:", err);
    return NextResponse.json({ error: "Failed to load fixtures" }, { status: 500 });
  }
}
