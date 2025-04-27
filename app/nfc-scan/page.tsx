"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NFCScanPage() {
  const router = useRouter();
  const [nfcId, setNfcId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleScan() {
    setLoading(true);

    const res = await fetch(`/api/nfc/${nfcId}`);
    if (res.ok) {
      const patient = await res.json();
      router.push(`/admin/patients/${patient.id}`);
    } else {
      alert("Patient not found for this NFC ID!");
    }

    setLoading(false);
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
          onClick={handleScan}
          disabled={loading || !nfcId}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Scanning..." : "Scan Tag"}
        </button>
      </div>
    </div>
  );
}
