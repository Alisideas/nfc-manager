// app/admin/patients/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  illness: string;
  nfcId: string;
  photoUrl: string | null;
  nextAppointment: string | null;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    async function fetchPatients() {
      const res = await fetch("/api/nfc");
      const data = await res.json();
      setPatients(data);
    }

    fetchPatients();
  }, []);

  return (
    <div className="p-8">
      <Link
          className="flex items-center mb-6 cursor-pointer hover:text-blue-500 w-10 h-10"
          href={"/"}
          prefetch={false}
        >
          👈
          <span className="ml-2">Back</span>
        </Link>
      <h1 className="text-3xl font-bold mb-6">Patients List</h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-300">Photo</th>
              <th className="p-3 border border-gray-300">Name</th>
              <th className="p-3 border border-gray-300">Illness</th>
              <th className="p-3 border border-gray-300">NFC ID</th>
              <th className="p-3 border border-gray-300">Next Appointment</th>
              <th className="p-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="text-center">
                <td className="p-3 border border-gray-300">
                  {patient.photoUrl ? (
                    <Image
                      src={patient.photoUrl}
                      alt="Patient Photo"
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto" />
                  )}
                </td>
                <td className="p-3 border border-gray-300">
                  {patient.firstName} {patient.lastName}
                </td>
                <td className="p-3 border border-gray-300">{patient.illness}</td>
                <td className="p-3 border border-gray-300">{patient.nfcId}</td>
                <td className="p-3 border border-gray-300">
                  {patient.nextAppointment ? (
                    <div className="flex flex-col items-center">
                      <span>
                        {new Date(patient.nextAppointment).toLocaleString()}
                      </span>
                      {new Date(patient.nextAppointment).getTime() -
                        Date.now() <
                        7 * 24 * 60 * 60 * 1000 && (
                        <span className="mt-1 inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Soon 🚨
                        </span>
                      )}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 border border-gray-300">
                  <Link
                    href={`/admin/patients/${patient.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
