"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTrips } from "@/hooks/queries/use-trips";
import { useAssignments } from "@/hooks/queries/use-assignments";

const OperationsOverview = () => {
  const { data: trips } = useTrips();
  const { data: assignments } = useAssignments({ scope: "awaiting", limit: 5 });

  const activeCount = trips?.active.length ?? 0;
  const todayCount = trips?.today.length ?? 0;
  const pendingAssignments = assignments?.items.length ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Trips & assignments</CardTitle>
          <p className="mt-1 text-sm text-default-500">
            {pendingAssignments} pending assignments · {activeCount} active trips · {todayCount} today
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/assignments">Assignments</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/wallet">Wallet</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/trips">Active Trips</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {(trips?.active ?? []).slice(0, 3).map((trip) => (
          <Link
            key={trip.id}
            href={`/trips/${trip.id}`}
            className="block rounded-lg border border-border p-3 transition-colors hover:bg-default-50"
          >
            <p className="font-medium text-default-900">{trip.bookingNumber}</p>
            <p className="text-sm text-default-600">
              {trip.customer.firstName} {trip.customer.lastName} · {trip.route.pickupTime}
            </p>
          </Link>
        ))}
        {activeCount === 0 ? (
          <p className="text-sm text-default-500">No active trips. Check assignments for new requests.</p>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default OperationsOverview;
