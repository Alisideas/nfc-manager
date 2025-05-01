// app/admin/add-patient/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AddPatientForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    photoUrl: "",
    idNumber: "",
    trackingId: "",
    gender: "",
    age: 0,
    medicalHistory: "",
    specificDesase: "",
    insuranceType: "",
    referredDoctor: "",
    bodyPartAffected: "",
    NumberOfBodyPartsAffected: 0,
    visitingType: "",
    address: "",
    phoneNumber: "",
    email: "",
    relatedImages: [""],
    illness: "",
    nfcId: "",
    currentAppointment: "",
    nextAppointment: "",
  });

  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/admin/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast.success("Patient created successfully!");
      router.push("/admin/patients");
    } else {
      const errorText = await response.text();
      toast.error("Failed to create patient: " + errorText);
    }
  };

  if (!isClient) return null;

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
            <input type="text" placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="ID Number" value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Tracking ID" value={formData.trackingId} onChange={(e) => setFormData({ ...formData, trackingId: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="p-2 border rounded" />
            <input type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: +e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Medical History" value={formData.medicalHistory} onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Specific Disease" value={formData.specificDesase} onChange={(e) => setFormData({ ...formData, specificDesase: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Insurance Type" value={formData.insuranceType} onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Referred Doctor" value={formData.referredDoctor} onChange={(e) => setFormData({ ...formData, referredDoctor: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Body Part Affected" value={formData.bodyPartAffected} onChange={(e) => setFormData({ ...formData, bodyPartAffected: e.target.value })} className="p-2 border rounded" />
            <input type="number" placeholder="Number of Body Parts Affected" value={formData.NumberOfBodyPartsAffected} onChange={(e) => setFormData({ ...formData, NumberOfBodyPartsAffected: +e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Visiting Type" value={formData.visitingType} onChange={(e) => setFormData({ ...formData, visitingType: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="p-2 border rounded" />
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Illness" value={formData.illness} onChange={(e) => setFormData({ ...formData, illness: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="NFC ID" value={formData.nfcId} onChange={(e) => setFormData({ ...formData, nfcId: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Photo URL" value={formData.photoUrl} onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })} className="p-2 border rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <input type="datetime-local" placeholder="Current Appointment" value={formData.currentAppointment} onChange={(e) => setFormData({ ...formData, currentAppointment: e.target.value })} className="p-2 border rounded" />
            <input type="datetime-local" placeholder="Next Appointment" value={formData.nextAppointment} onChange={(e) => setFormData({ ...formData, nextAppointment: e.target.value })} className="p-2 border rounded" />
          </div>

          <div className="mt-4">
            <label className="block font-medium mb-1">Related Image URLs</label>
            {formData.relatedImages.map((url, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const updated = [...formData.relatedImages];
                    updated[index] = e.target.value;
                    setFormData({ ...formData, relatedImages: updated });
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => {
                    const updated = formData.relatedImages.filter((_, i) => i !== index);
                    setFormData({ ...formData, relatedImages: updated });
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-500 mt-1"
              onClick={() =>
                setFormData({ ...formData, relatedImages: [...formData.relatedImages, ""] })
              }
            >
              + Add Image URL
            </button>
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