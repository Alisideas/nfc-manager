// app/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

export default async function Home() {
  const patients = await prisma.patient.findMany();

  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      status: "upcoming",
      date: {
        gte: new Date(),
      },
    },
    orderBy: {
      date: "asc",
    },
    include: {
      patient: true,
    },
    take: 5,
  });

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🏥 Clinic Dashboard</h1>

      {/* Upcoming Appointments */}
      <div className="mb-10">
        <div className="border rounded p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            📅 Upcoming Appointments
          </h2>
          <hr className="my-2" />
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments.</p>
          ) : (
            <ul className="space-y-2">
              {upcomingAppointments.map((appointment) => (
                <div>
                  <li key={appointment.id} className="flex justify-between">
                    <div>
                      {appointment.patient?.firstName}{" "}
                      {appointment.patient?.lastName}
                    </div>
                    <div className="text-gray-600">
                      {format(new Date(appointment.date), "PPP p")}
                    </div>
                  </li>
                  <hr className="my-2" />
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Patient List */}
      <div className="justify-between mb-6 flex flex-row">
        <div className="mb-6">
          <Link
            href="/admin/add-patient"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            ➕ Add New Patient
          </Link>
        </div>
        <div className="flex flex-row gap-4">
          <div className="mb-6">
            <Link
              href="/admin/patients"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              prefetch={false}
            >
              📋 View All Patients
            </Link>
          </div>
          <div className="mb-6">
            <Link
              href="/nfc-scan"
              className="bg-blue-700 text-white px-2 py-2 rounded hover:bg-blue-600"
              prefetch={false}
            >
              🔍 NFC
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.map((patient) => (
          <Link

            href={`/admin/patients/${patient.id}`}
            key={patient.id}
            className="border p-4 rounded shadow hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4" key={patient.id}>
              <Image
                src={patient.photoUrl || "/default-avatar.png"}
                alt={`${patient.firstName} ${patient.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {patient.firstName} {patient.lastName}
                </h2>
                <p className="text-gray-500">{patient.illness}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
