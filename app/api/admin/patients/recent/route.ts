import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const recentPatients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    where: {
      userId: currentUser.id,
    },
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
