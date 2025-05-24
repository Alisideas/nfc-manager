"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

import { Users, ScanLine, DollarSign, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { RecentPatients } from "@/components/recentPatients";
import { SafeUser } from "@/types";

import { signOut } from "next-auth/react";
import { HiOutlineDotsVertical } from "react-icons/hi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

interface HomeClientProps {
  currentUser: SafeUser | null;
}

const HomeClient: React.FC<HomeClientProps> = ({ currentUser }) => {
  const [patientCount, setPatientCount] = useState<number>(0);
  const [todayAppointments, setTodayAppointments] = useState<number>(0);
  const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);

  const daysLeft = subscriptionEnd
    ? Math.ceil(
        (subscriptionEnd.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;
  useEffect(() => {
    fetch("/api/admin/patients/count")
      .then((res) => res.json())
      .then((data) => setPatientCount(data.count));

    fetch("/api/admin/appointments/today")
      .then((res) => res.json())
      .then((data) => setTodayAppointments(data.count));

    fetch("/api/subscription")
      .then((res) => res.json())
      .then((data) => {
        if (data.subscription?.endDate) {
          setSubscriptionEnd(new Date(data.subscription.endDate));
        }
      });
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      {currentUser?.hasDesktopApp ? null : (
  <div className="bg-yellow-100 border border-yellow-300 p-4 rounded mb-6 flex justify-between items-center">
    <div>
      <p className="text-sm text-yellow-800 font-medium">
        You haven’t installed the desktop app yet.
      </p>
      <p className="text-xs text-yellow-700">
        Click below to receive a download link or mark the app as installed.
      </p>
    </div>
    <div className="flex gap-2">
      <button
        onClick={async () => {
          const res = await fetch("/api/send-desktop-link", {
            method: "POST",
            body: JSON.stringify({ email: currentUser?.email }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (res.ok) {
            toast.success("Download link sent to your email.");
          } else {
            toast.error("Failed to send email.");
          }
        }}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
      >
        Send Link
      </button>
      <button
        onClick={async () => {
          const res = await fetch("/api/user/set-desktop-app", {
            method: "POST",
          });

          if (res.ok) {
            toast.success("Marked as installed. Please refresh.");
          } else {
            toast.error("Failed to update user.");
          }
        }}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
      >
        Mark as Installed
      </button>
    </div>
  </div>
)}


      <div className="relative bg-blue-50 rounded-xl p-8 overflow-hidden shadow mb-8 relative z-5">
        <div className="flex flex-row items-center justify-between">
          <div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Welcome back {currentUser?.username} 👋
              </h1>
              <p className="mt-2 text-gray-700 text-xl">
                Manage your patients and appointments with ease.
              </p>
              <p className="mt-2 text-gray-700 text-xs">
                Easily track patients, appointments, payments, and NFC-tag
                profiles — all in one place.
              </p>
              <div className="mt-4">
                {subscriptionEnd ? (
                  <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                    Your subscription ends on{" "}
                    <span className="underline font-bold">{daysLeft}</span>
                    <span> Days 🎉</span>
                  </span>
                ) : (
                  <span className="inline-block bg-red-500 text-white py-2 px-4 rounded">
                    No subscription found
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="z-10 flex absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative z-20 p-2 cursor-pointer">
                  <HiOutlineDotsVertical className="text-2xl" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem disabled>
                  {currentUser?.email}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (currentUser?.secretCode) {
                      navigator.clipboard.writeText(currentUser.secretCode);
                      toast.success("Secret code copied to clipboard!");
                    }
                  }}
                  className="cursor-pointer"
                >
                  Copy Secret Code !
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer bg-red-700 text-white"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
};

export default HomeClient;
