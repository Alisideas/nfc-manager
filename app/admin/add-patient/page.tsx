// app/admin/add-patient/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface NDEFReadingEvent extends Event {
  serialNumber: string;
  message: { records: NDEFRecord[] };
}
// Define the NDEFRecord interface
interface NDEFRecord {
  recordType: string;
  mediaType: string;
  id: string;
  data: string;
}

// Declare global type for NDEFReader
declare global {
  interface Window {
    NDEFReader?: {
      new (): {
        scan: () => Promise<void>;
        onreading: (event: NDEFReadingEvent) => void;
      };
    };
  }
}
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AddPatientForm() {
  const [isClient, setIsClient] = useState(false);
  const [isReadingNfc, setIsReadingNfc] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const searchParams = useSearchParams(); // ✅ NEW
  const nfcIdFromQuery = searchParams?.get("nfcId") ?? "";
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
    nfcId: nfcIdFromQuery,
    currentAppointment: "",
    nextAppointment: "",
  });
  useEffect(() => {
    const tagId = searchParams.get("nfcId");
    if (tagId) {
      setFormData((prev) => ({ ...prev, nfcId: tagId }));
      toast.success(`Pre-filled NFC ID from desktop: ${tagId}`);
    }
  }, [searchParams]);

  const handleReadNfcTag = async () => {
    try {
      toast.loading("Waiting for NFC tag to be scanned...");

      const checkUid = async (): Promise<string | null> => {
        const res = await fetch("/api/nfc/scan");
        const data = await res.json();
        return data.uid;
      };

      let retries = 20;
      let uid = null;

      while (retries-- > 0) {
        uid = await checkUid();
        if (uid) break;
        await new Promise((r) => setTimeout(r, 1000)); // wait 1 second
      }

      if (uid) {
        setFormData((prev) => ({ ...prev, nfcId: uid }));
        toast.success(`Tag read: ${uid}`);
      } else {
        toast.error("No tag detected. Please try again.");
      }
    } catch (err: unknown) {
      toast.error("Failed to read NFC tag.");
    }
  };

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
      <div className="max-w-xl mx-auto p-4 shadow-md rounded mt-8">
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
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <input
              type="text"
              placeholder="ID Number"
              value={formData.idNumber}
              onChange={(e) =>
                setFormData({ ...formData, idNumber: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <input
              type="text"
              placeholder="Tracking ID"
              value={formData.trackingId}
              onChange={(e) =>
                setFormData({ ...formData, trackingId: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="p-2 border rounded text-black"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: +e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <select
              value={formData.medicalHistory}
              onChange={(e) =>
                setFormData({ ...formData, medicalHistory: e.target.value })
              }
              className="p-2 border rounded text-black"
            >
              <option value="">Select Medical History</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <input
              type="text"
              placeholder="Specific Disease"
              value={formData.specificDesase}
              onChange={(e) =>
                setFormData({ ...formData, specificDesase: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <select
              value={formData.insuranceType}
              onChange={(e) =>
                setFormData({ ...formData, insuranceType: e.target.value })
              }
              className="p-2 border rounded text-black"
            >
              <option value="">Select Insurance Type</option>
              <option value="private">Khadamat darmani</option>
              <option value="public">Niroohaye mosallah</option>
              <option value="none">None</option>
            </select>
            <input
              type="text"
              placeholder="Referred Doctor"
              value={formData.referredDoctor}
              onChange={(e) =>
                setFormData({ ...formData, referredDoctor: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <input
              type="text"
              placeholder="Body Part Affected"
              value={formData.bodyPartAffected}
              onChange={(e) =>
                setFormData({ ...formData, bodyPartAffected: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <input
              type="number"
              placeholder="Number of Body Parts Affected"
              value={formData.NumberOfBodyPartsAffected}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  NumberOfBodyPartsAffected: +e.target.value,
                })
              }
              className="p-2 border rounded text-black"
            />
            <select
              value={formData.visitingType}
              onChange={(e) =>
                setFormData({ ...formData, visitingType: e.target.value })
              }
              className="p-2 border rounded text-black"
            >
              <option value="">Select Visiting Type</option>
              <option value="in-person">Face-to-Face</option>
              <option value="online">Online</option>
              <option value="phone">Phone</option>
            </select>
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <input
              type="text"
              placeholder="Illness"
              value={formData.illness}
              onChange={(e) =>
                setFormData({ ...formData, illness: e.target.value })
              }
              className="p-2 border rounded text-black"
            />
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="NFC ID"
                value={formData.nfcId}
                onChange={(e) =>
                  setFormData({ ...formData, nfcId: e.target.value })
                }
                className="p-2 border rounded flex-1"
              />
              <button
                type="button"
                onClick={handleReadNfcTag}
                disabled={isReadingNfc}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-white transition-colors duration-300 ${
                  isReadingNfc
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isReadingNfc ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Reading...
                  </>
                ) : (
                  "Read NFC"
                )}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium">Patient Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formDataFile = new FormData();
                  formDataFile.append("file", file);

                  try {
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: formDataFile,
                    });

                    const data = await res.json();
                    if (res.ok && data.url) {
                      setFormData((prev) => ({ ...prev, photoUrl: data.url }));
                      toast.success("Photo uploaded to Cloudinary!");
                    } else {
                      toast.error("Upload failed.");
                    }
                  } catch (err: unknown) {
                    if (err instanceof Error) {
                      toast.error("Upload error" + err.message);
                    } else {
                      toast.error("Upload error");
                    }
                  }
                }}
                className="border p-2 rounded"
              />

              {formData.photoUrl && (
                <Image
                  width={100}
                  height={100}
                  src={formData.photoUrl}
                  alt="Uploaded"
                  className="w-24 h-24 object-cover rounded border mt-2"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p>Current Appointment</p>
              <input
                type="datetime-local"
                placeholder="Current Appointment"
                value={formData.currentAppointment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentAppointment: e.target.value,
                  })
                }
                className="p-2 border rounded text-black"
              />
            </div>
            <div>
              <p>Next Appointment</p>
              <input
                type="datetime-local"
                placeholder="Next Appointment"
                value={formData.nextAppointment}
                onChange={(e) =>
                  setFormData({ ...formData, nextAppointment: e.target.value })
                }
                className="p-2 border rounded text-black"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-medium mb-1">Related Images</label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;

                const uploadedUrls: string[] = [];

                for (const file of Array.from(files)) {
                  const formData = new FormData();
                  formData.append("file", file);

                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });

                  const data = await res.json();
                  if (res.ok && data.url) {
                    uploadedUrls.push(data.url);
                  } else {
                    toast.error("One or more images failed to upload.");
                  }
                }

                setFormData((prev) => ({
                  ...prev,
                  relatedImages: [...prev.relatedImages, ...uploadedUrls],
                }));
                toast.success("Images uploaded!");
              }}
              className="border p-2 rounded"
            />

            {/* Preview thumbnails */}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.relatedImages.map((url, index) => (
                <div key={index} className="relative w-20 h-20">
                  <Image
                    width={100}
                    height={100}
                    src={url}
                    alt={`Image ${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.relatedImages.filter(
                        (_, i) => i !== index
                      );
                      setFormData({ ...formData, relatedImages: updated });
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
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
