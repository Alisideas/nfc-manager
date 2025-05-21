"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Subscriptions</h1>

      {loading ? (
        <p>Loading...</p>
      ) : subscriptions.length === 0 ? (
        <p>No subscriptions found.</p>
      ) : (
        <div className="grid gap-4">
          {subscriptions.map((sub) => (
            <Card key={sub.id}>
              <CardHeader>
                <CardTitle>{sub.plan}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: <span className="font-medium">{sub.status}</span></p>
                <p>Start: {new Date(sub.startDate).toLocaleDateString()}</p>
                <p>End: {new Date(sub.endDate).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
