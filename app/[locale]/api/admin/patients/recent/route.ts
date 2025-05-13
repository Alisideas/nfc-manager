import  prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const recentPatients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      photoUrl: true,
      createdAt: true,
    },
  });

  return NextResponse.json(recentPatients);
}
