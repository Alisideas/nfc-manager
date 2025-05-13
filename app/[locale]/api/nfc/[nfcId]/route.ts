import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = {
  params: { nfcId: string };
};

export async function GET(req: Request, { params }: Params) {
  const patient = await prisma.patient.findUnique({
    where: { nfcId: params.nfcId },
  });

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  return NextResponse.json(patient);
}
