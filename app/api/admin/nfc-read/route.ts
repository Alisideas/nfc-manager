// app/api/admin/nfc-read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { nfcId } = await req.json();

    if (!nfcId) {
      return NextResponse.json({ error: 'Missing NFC ID' }, { status: 400 });
    }

    // Optional: Log or do something with the NFC ID
    console.log("📥 NFC ID received:", nfcId);

    // Find the patient with this NFC ID
    const patient = await prisma.patient.findUnique({
      where: { nfcId },
    });

    if (!patient) {
      return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
    }

    // Respond with patient info
    return NextResponse.json({ patient });
  } catch (error) {
    console.error("❌ API error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
