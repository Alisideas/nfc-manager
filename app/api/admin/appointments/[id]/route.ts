import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointmentId = params.id;
    const { date, description, status } = await req.json();

    if (!date || !description || !status) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date: new Date(date),
        description,
        status,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment." },
      { status: 500 }
    );
  }
}
