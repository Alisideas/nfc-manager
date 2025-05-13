"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface Payment {
  id: string;
  amount: number;
  method: string;
  date: string;
  notes: string;
}

export default function PatientPaymentsPage() {
  const { id } = useParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/patients/${id}/payments`)
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load payments");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="p-8 min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href={`/admin/patients/${id}`}
        className="text-blue-500 hover:underline mb-4 block"
      >
        ← Back to Profile
      </Link>
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      <Link
        href={`/admin/patients/${id}/payments/new`}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 inline-block"
      >
        + Add Payment
      </Link>

      <div className="overflow-x-auto mt-4">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Method</th>
              <th className="border px-4 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="text-center">
                <td className="border px-4 py-2">
                  {new Date(p.date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">${p.amount.toFixed(2)}</td>
                <td className="border px-4 py-2">{p.method}</td>
                <td className="border px-4 py-2">{p.notes || "-"}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4 text-gray-500"
                >
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
