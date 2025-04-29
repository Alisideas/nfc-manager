// app/admin/add-patient/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import Link from "next/link";
import toast from "react-hot-toast";

export default function AddPatientForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    photoUrl: "",
    illness: "",
    nfcId: "",
    currentAppointment: "",
    nextAppointment: "",
  });
  const [isClient, setIsClient] = useState(false);
  const router = useRouter(); // useRouter from next/navigation instead

  // Ensure useRouter is called only after the component is mounted client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      nextAppointment: formData.nextAppointment
        ? formData.nextAppointment
        : undefined,
    };

    const response = await fetch("/api/admin/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Patient created successfully!");
      router.push("/admin/patients");
    } else {
      const errorText = await response.text();
      toast.error("Failed to create patient: " + errorText);
    }
  };

  if (!isClient) return null; // Don't render the form until client-side is ready

  return (
    <div>
      <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded mt-8">
        <Link
          className="flex items-center mb-6 cursor-pointer hover:text-blue-500 w-10 h-10"
          href={"/"}
          prefetch={false}
        >
          👈
          <span className="ml-2">Back</span>
        </Link>
        <h2 className="text-2xl font-semibold mb-4">Add New Patient</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                className="p-2 border rounded "
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                className="p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="illness" className="block">
                Illness
              </label>
              <input
                type="text"
                id="illness"
                value={formData.illness}
                onChange={(e) =>
                  setFormData({ ...formData, illness: e.target.value })
                }
                required
                className="p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="nfcId" className="block">
                NFC ID
              </label>
              <input
                type="text"
                id="nfcId"
                value={formData.nfcId}
                onChange={(e) =>
                  setFormData({ ...formData, nfcId: e.target.value })
                }
                required
                className="p-2 border rounded"
              />
            </div>
          </div>

          {/* Optional Appointment Fields */}
          <div>
            <label htmlFor="nextAppointment" className="block">
              Next Appointment (Optional)
            </label>
            <input
              type="datetime-local"
              id="nextAppointment"
              value={formData.nextAppointment}
              onChange={(e) =>
                setFormData({ ...formData, nextAppointment: e.target.value })
              }
              className="p-2 border rounded"
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full"
            >
              Create Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
