// app/api/admin/patients/count/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const count = await prisma.patient.count({
    where: {
      userId: currentUser.id,
    },
  });

  return NextResponse.json({ count });
}
