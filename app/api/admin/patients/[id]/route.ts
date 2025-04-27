import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // assuming you have a prisma instance
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      history: true, // appointments history if you have it
    },
  });

  if (!patient) {
    return new Response("Patient not found", { status: 404 });
  }

  return Response.json(patient);
}


export async function PUT(req: Request, { params }: Params) {
  const data = await req.json();
  const updatedPatient = await prisma.patient.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updatedPatient);
}
