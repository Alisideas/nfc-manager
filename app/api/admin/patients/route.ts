import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { firstName, lastName, photoUrl, illness, nfcId, nextAppointment } = body;

    // 1. Create the patient
    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        photoUrl,
        illness,
        nfcId,
      },
    });

    // 2. (Optional) Create the next appointment if nextAppointment exists
    if (nextAppointment) {
      await prisma.appointment.create({
        data: {
          patientId: patient.id,
          date: new Date(nextAppointment),
          description: "Initial Appointment",
          status: "upcoming",
        },
      });
    }

    return new Response(JSON.stringify(patient), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to create patient", { status: 400 });
  }
}
