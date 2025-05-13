import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      photoUrl,
      idNumber,
      trackingId,
      gender,
      age,
      medicalHistory,
      specificDesase,
      insuranceType,
      referredDoctor,
      bodyPartAffected,
      NumberOfBodyPartsAffected,
      visitingType,
      address,
      phoneNumber,
      email,
      relatedImages,
      illness,
      nfcId,
      currentAppointment,
      nextAppointment,
    } = body;

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        photoUrl,
        idNumber,
        trackingId,
        gender,
        age,
        medicalHistory,
        specificDesase,
        insuranceType,
        referredDoctor,
        bodyPartAffected,
        NumberOfBodyPartsAffected,
        visitingType,
        address,
        phoneNumber,
        email,
        relatedImages,
        illness,
        nfcId,
        currentAppointment: currentAppointment ? new Date(currentAppointment) : undefined,
        nextAppointment: nextAppointment ? new Date(nextAppointment) : undefined,
      },
    });

    // Optionally create initial appointment from nextAppointment
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
