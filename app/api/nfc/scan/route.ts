import { NextRequest, NextResponse } from "next/server";
import { cache } from "@/lib/nfcCache"; // You’ll write this

export async function POST(req: NextRequest) {
  const { uid } = await req.json();

  if (!uid) {
    return NextResponse.json({ error: "Missing UID" }, { status: 400 });
  }

  cache.uid = uid; // save in memory or DB
  return NextResponse.json({ message: "UID received", uid });
}

export async function GET() {
  return NextResponse.json({ uid: cache.uid || null });
}
