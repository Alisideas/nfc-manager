// updated PatientDetailPage with relatedImages thumbnail and carousel
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { BsThreeDots, BsPencil } from "react-icons/bs";
import Image from "next/image";

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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const [form, setForm] = useState({
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
    relatedImages: [] as string[],
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
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        photoUrl: data.photoUrl || "",
        idNumber: data.idNumber || "",
        trackingId: data.trackingId || "",
        gender: data.gender || "",
        age: data.age || 0,
        medicalHistory: data.medicalHistory || "",
        specificDesase: data.specificDesase || "",
        insuranceType: data.insuranceType || "",
        referredDoctor: data.referredDoctor || "",
        bodyPartAffected: data.bodyPartAffected || "",
        NumberOfBodyPartsAffected: data.NumberOfBodyPartsAffected || 0,
        visitingType: data.visitingType || "",
        address: data.address || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        relatedImages: data.relatedImages || [],
        illness: data.illness || "",
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSave() {
    await fetch(`/api/admin/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    toast.success("Patient updated successfully!");
    setEditingField(null);
  }

  async function handleDelete() {
    await fetch(`/api/admin/patients/${id}`, {
      method: "DELETE" });
    toast.success("Patient deleted successfully!");
    router.push("/");
  }

  const renderField = (key: keyof typeof form, label: string, type = "text") => (
    <div className="flex items-center gap-2">
      <label className="w-40 font-medium text-gray-700">{label}:</label>
      <input
        type={type}
        value={form[key] as string | number}
        disabled={editingField !== key}
        onChange={(e) => setForm({ ...form, [key]: type === 'number' ? +e.target.value : e.target.value })}
        className={`border p-2 rounded w-full ${editingField === key ? "bg-white" : "bg-gray-100"}`}
      />
      <BsPencil
        className="cursor-pointer text-gray-500 hover:text-blue-500"
        onClick={() => setEditingField(key === editingField ? null : key)}
      />
    </div>
  );

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link className="flex items-center mb-6 cursor-pointer hover:text-blue-500" href="/" prefetch={false}>
        👈 <span className="ml-2">Back</span>
      </Link>

      <div className="flex flex-row justify-between items-center gap-4 mb-4 relative">
        <h1 className="text-2xl font-bold">Patient Details</h1>
        <div className="relative" ref={dropdownRef}>
          <BsThreeDots className="text-xl cursor-pointer hover:text-blue-500" onClick={() => setDropdownOpen((prev) => !prev)} />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
              <button onClick={() => { setConfirmDialogOpen(true); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Delete Patient
              </button>
              <button onClick={() => { toast("Edit Appointment clicked!"); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Edit Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Photo */}
      <div className="mb-6 flex justify-center items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden">
          {form.photoUrl ? (
            <Image src={form.photoUrl} alt={form.firstName} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Photo</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {renderField("firstName", "First Name")}
        {renderField("lastName", "Last Name")}
        {renderField("photoUrl", "Photo URL")}
        {renderField("idNumber", "ID Number")}
        {renderField("trackingId", "Tracking ID")}
        {renderField("gender", "Gender")}
        {renderField("age", "Age", "number")}
        {renderField("medicalHistory", "Medical History")}
        {renderField("specificDesase", "Specific Disease")}
        {renderField("insuranceType", "Insurance Type")}
        {renderField("referredDoctor", "Referred Doctor")}
        {renderField("bodyPartAffected", "Body Part Affected")}
        {renderField("NumberOfBodyPartsAffected", "# of Body Parts Affected", "number")}
        {renderField("visitingType", "Visiting Type")}
        {renderField("address", "Address")}
        {renderField("phoneNumber", "Phone Number")}
        {renderField("email", "Email")}
        {renderField("illness", "Illness")}

        <button onClick={handleSave} disabled={loading} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4 disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Related Images */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Related Images</h2>
        <div className="flex flex-wrap gap-4">
          {form.relatedImages.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`Related ${index}`}
              className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80"
              onClick={() => { setCarouselIndex(index); setShowCarousel(true); }}
            />
          ))}
        </div>
      </div>

      {/* Carousel */}
      {showCarousel && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <Image src={form.relatedImages[carouselIndex]} alt={`Slide ${carouselIndex}`} className="max-w-[90vw] max-h-[80vh] rounded shadow" />
          <div className="mt-4 flex gap-4">
            <button onClick={() => setCarouselIndex((carouselIndex - 1 + form.relatedImages.length) % form.relatedImages.length)} className="text-white text-lg">⬅️ Prev</button>
            <button onClick={() => setShowCarousel(false)} className="text-white text-lg">Close ✖️</button>
            <button onClick={() => setCarouselIndex((carouselIndex + 1) % form.relatedImages.length)} className="text-white text-lg">Next ➡️</button>
          </div>
        </div>
      )}

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

      {confirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this patient?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setConfirmDialogOpen(false)} className="px-4 py-2 rounded border hover:bg-gray-100">Cancel</button>
              <button onClick={() => { setConfirmDialogOpen(false); handleDelete(); }} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}