import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // assuming you have a prisma instance

// GET Patient
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      history: true, // appointments history
    },
  });

  if (!patient) {
    return new Response("Patient not found", { status: 404 });
  }

  return NextResponse.json(patient);
}

// UPDATE Patient
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await req.json();

  const updatedPatient = await prisma.patient.update({
    where: { id },
    data,
  });

  return NextResponse.json(updatedPatient);
}

// DELETE Patient
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    
    // First delete all related appointments
    await prisma.appointment.deleteMany({
      where: { patientId: id },
    });

    await prisma.comment.deleteMany({
      where: { patientId: id },
    });
    // Then delete the patient
    await prisma.patient.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response("Error deleting patient", { status: 500 });
  }
}
