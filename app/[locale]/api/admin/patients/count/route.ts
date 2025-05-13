// app/api/admin/patients/count/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const count = await prisma.patient.count();
  return NextResponse.json({ count });
}