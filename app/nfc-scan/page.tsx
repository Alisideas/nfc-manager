"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
