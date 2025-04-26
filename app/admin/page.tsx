// app/admin/page.tsx
import Link from "next/link";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  illness: string;
}

async function getPatients() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/patients`, { cache: 'no-store' });
  return res.json();
}

export default async function AdminPage() {
  const patients: Patient[] = await getPatients();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin - Patients List</h1>
      <div className="grid gap-4">
        {patients.map((patient) => (
          <div key={patient.id} className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">{patient.firstName} {patient.lastName}</h2>
            <p className="text-gray-600">Illness: {patient.illness}</p>
            <Link href={`/admin/patients/${patient.id}`} className="text-blue-500 mt-2 inline-block">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
