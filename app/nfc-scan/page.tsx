"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

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

export default function NFCScanPage() {
  const router = useRouter();
  const [nfcId, setNfcId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleScanByInput() {
    setLoading(true);
    const res = await fetch(`/api/nfc/${nfcId}`);
    if (res.ok) {
      const patient = await res.json();
      router.push(`/admin/patients/${patient.id}`);
    } else {
      toast.error("Patient not found for this NFC ID!");
    }
    setLoading(false);
  }

  async function handleReadNfcTag() {
    if (!("NDEFReader" in window)) {
      toast.error("Web NFC is not supported in this browser.");
      return;
    }

    try {
      const ndef = new window.NDEFReader!();
      await ndef.scan();
      toast("Hold the NFC card near the device...");

      ndef.onreading = async (event) => {
        const tagId = event.serialNumber;
        if (!tagId) {
          toast.error("No NFC ID found.");
          return;
        }

        toast.success(`Tag read: ${tagId}`);
        setNfcId(tagId);
        setLoading(true);

        const res = await fetch(`/api/nfc/${tagId}`);
        if (res.ok) {
          const patient = await res.json();
          router.push(`/admin/patients/${patient.id}`);
        } else {
          toast.error("Patient not found for this NFC ID!");
        }

        setLoading(false);
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("NFC read failed: " + err.message);
      } else {
        toast.error("NFC read failed.");
      }
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <Link
        className="flex items-center mb-6 cursor-pointer hover:text-blue-500 w-10 h-10"
        href={"/"}
        prefetch={false}
      >
        👈
        <span className="ml-2">Back</span>
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-center">🔍 Scan NFC Tag</h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter NFC ID..."
          value={nfcId}
          onChange={(e) => setNfcId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleScanByInput}
          disabled={loading || !nfcId}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Searching..." : "Search by NFC ID"}
        </button>

        <button
          onClick={handleReadNfcTag}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          📲 Read NFC Tag
        </button>
      </div>
    </div>
  );
}
