"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Subscription {
  id: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export default function PaymentsClient() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const res = await fetch("/api/admin/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions);
      }
      setLoading(false);
    };

    fetchSubscriptions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <Link
        className="flex items-center mb-6 cursor-pointer hover:text-blue-500"
        href="/"
        prefetch={false}
      >
        👈 <span className="ml-2">Back</span>
      </Link>
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Your Subscriptions
      </h1>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-md" />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center text-muted-foreground mt-8">
          You don’t have any active subscriptions.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {subscriptions.map((sub) => (
            <Card key={sub.id} className="shadow-md border">
              <CardHeader>
                <CardTitle className="text-xl">
                  {sub.plan.toUpperCase()}
                </CardTitle>
                <CardDescription>
                  Subscription started on{" "}
                  {new Date(sub.startDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="text-black ">Status: </span>
                  <Badge
                    variant={
                      sub.status === "active" ? "default" : "destructive"
                    }
                  >
                    {sub.status.toUpperCase()}
                  </Badge>
                </p>
                <p>
                  <span className="text-black">Start Date: </span>
                  {new Date(sub.startDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-black">End Date: </span>
                  {new Date(sub.endDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
