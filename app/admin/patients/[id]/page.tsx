"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { BsThreeDots } from "react-icons/bs";

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
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    photoUrl: "",
    illness: "",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleSave() {
    await fetch(`/api/admin/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    toast.success("Patient updated successfully!");
  }

  async function handleDelete() {
    await fetch(`/api/admin/patients/${id}`, {
      method: "DELETE",
    });
    toast.success("Patient deleted successfully!");
    router.push("/");
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        className="flex items-center mb-6 cursor-pointer hover:text-blue-500"
        href={"/"}
        prefetch={false}
      >
        👈
        <span className="ml-2">Back</span>
      </Link>

      <div className="flex flex-row justify-between items-center gap-4 mb-4 relative">
        <h1 className="text-2xl font-bold ">Edit Patient Info</h1>
        <div className="relative" ref={dropdownRef}>
          <BsThreeDots
            className="text-xl cursor-pointer hover:text-blue-500 transition ease-in"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
              <button
                onClick={() => {
                  setConfirmDialogOpen(true);
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Delete Patient
              </button>
              <button
                onClick={() => {
                  toast("Edit Appointment clicked!");
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Patient Photo */}
      <div className="mb-4 flex justify-center items-center gap-4">
        <div className="w-32 h-32 rounded-full overflow-hidden">
          {form.photoUrl ? (
            <img
              src={form.photoUrl}
              alt={form.firstName}
              width={200}
              height={200}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Photo</span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
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

      {/* Appointment History */}
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

      {/* Confirmation Dialog */}
      {confirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this patient?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDialogOpen(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmDialogOpen(false);
                  handleDelete();
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
