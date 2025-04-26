"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Appointment {
  id: string;
  date: string;
  description: string;
  status: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  illness: string;
  history: Appointment[];
}

export default function PatientDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    photoUrl: "",
    illness: "",
  });

  useEffect(() => {
    if (!id) return;
    async function fetchPatient() {
      const res = await fetch(`/api/admin/patients/${id}`);
      const data = await res.json();
      setPatient(data);
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        photoUrl: data.photoUrl,
        illness: data.illness,
      });
      setLoading(false);
    }
    fetchPatient();
  }, [id]);

  async function handleSave() {
    await fetch(`/api/admin/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Patient updated successfully!");
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button className="flex items-center mb-6 cursor-pointer hover:text-blue-500" onClick={() => router.push("/admin/patients")}>
      👈
      </button>
      <h1 className="text-2xl font-bold mb-6">Edit Patient Info</h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Photo URL"
          value={form.photoUrl}
          onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Illness"
          value={form.illness}
          onChange={(e) => setForm({ ...form, illness: e.target.value })}
          className="border p-2 rounded"
        />
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Appointment History</h2>
        <ul className="list-disc list-inside">
          {patient?.history.map((appt) => (
            <li key={appt.id}>
              {new Date(appt.date).toLocaleString()} - {appt.description} ({appt.status})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
