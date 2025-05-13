"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

import { Users, ScanLine, DollarSign, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { RecentPatients } from "@/components/recentPatients";

export default function HomeClient() {
  const [patientCount, setPatientCount] = useState<number>(0);
  const [todayAppointments, setTodayAppointments] = useState<number>(0);

  useEffect(() => {
    fetch("/api/admin/patients/count")
      .then((res) => res.json())
      .then((data) => setPatientCount(data.count));

    fetch("/api/admin/appointments/today")
      .then((res) => res.json())
      .then((data) => setTodayAppointments(data.count));
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="relative bg-blue-50 rounded-xl p-8 overflow-hidden shadow mb-8">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome to the Patient Management Dashboard
          </h1>
          <p className="mt-2 text-gray-700 text-lg">
            Easily track patients, appointments, payments, and NFC-tag profiles
            — all in one place.
          </p>
          <div className="mt-4">
            <a
              // href="/admin/add-patient"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Your subscription ends in 3 days 🎉
            </a>
          </div>
        </div>

        {/* Background Shape (optional aesthetic flair) */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-50 z-0"></div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Link href="/admin/add-patient">
          <Card className="hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Plus className="w-8 h-8 text-blue-600 mb-2" />
              <span className="font-medium">Add New Patient</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/patients">
          <Card className="hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <span className="font-medium">View All Patients</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/nfc-scan">
          <Card className="hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <ScanLine className="w-8 h-8 text-purple-600 mb-2" />
              <span className="font-medium">Scan NFC Tag</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/payments">
          <Card className="hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <DollarSign className="w-8 h-8 text-amber-600 mb-2" />
              <span className="font-medium">Payments</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Stats (optional placeholder) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-3xl font-semibold">{patientCount}</div>
            <div className="text-gray-500">Total Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-3xl font-semibold">{todayAppointments}</div>
            <div className="text-gray-500">Today&apos;s Appointments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm text-gray-500 mb-1">Pending Payments</h2>
            <p className="text-2xl font-semibold text-gray-900">$320</p>
          </CardContent>
        </Card>
        <RecentPatients />
      </section>
    </main>
  );
}
