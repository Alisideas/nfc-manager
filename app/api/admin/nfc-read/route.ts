// app/api/admin/nfc-read/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { nfcId } = body;

  console.log("📥 NFC ID received:", nfcId);

  if (!nfcId) {
    return NextResponse.json({ error: "Missing NFC ID" }, { status: 400 });
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { nfcId },
    });

    if (!patient) {
      return NextResponse.json({ patient: null });
    }

    return NextResponse.json({ patient });
  } catch (err) {
    console.error("❌ Error fetching patient:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
