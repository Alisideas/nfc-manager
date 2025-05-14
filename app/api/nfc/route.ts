import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patients = await prisma.patient.findMany({
    where: { userId },
    include: { history: true },
  });

  return NextResponse.json(patients);
}
