"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AddPaymentForm() {
  const router = useRouter();
  const { id: patientId } = useParams();

  const [form, setForm] = useState({
    amount: "",
    method: "cash",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId || typeof patientId !== "string") {
      toast.error("Invalid patient ID.");
      return;
    }

    const res = await fetch(`/api/admin/patients/${patientId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: form.amount,
        method: form.method,
        status: "completed", // ← this was undefined before
        description: form.notes,
      }),
    });

    if (res.ok) {
      toast.success("Payment added successfully!");
      router.push(`/admin/patients/${patientId}/payments`);
    } else {
      toast.error("Failed to add payment.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded space-y-4"
    >
      <h2 className="text-xl font-semibold">Add Payment</h2>

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        required
        className="w-full p-2 border rounded"
      />

      <select
        value={form.method}
        onChange={(e) => setForm({ ...form, method: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="insurance">Insurance</option>
      </select>

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
      >
        Submit Payment
      </button>
    </form>
  );
}
