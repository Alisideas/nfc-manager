import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  createdAt: string;
}

export function RecentPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetch("/api/admin/patients/recent")
      .then((res) => res.json())
      .then(setPatients)
      .catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {patients.map((patient) => (
            <li key={patient.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={patient.photoUrl || "/default-user.png"}
                  alt={patient.firstName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Link
                href={`/admin/patients/${patient.id}`}
                className="text-blue-500 text-sm hover:underline"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
