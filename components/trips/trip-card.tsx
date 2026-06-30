import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { TripSummary } from "@/lib/schemas/trip";
import { getCustomerName, tripStatusClasses, tripStatusLabels } from "@/lib/trips/trip-utils";

type TripCardProps = {
  trip: TripSummary;
  href: string;
};

const TripCard = ({ trip, href }: TripCardProps) => {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-default-900">{trip.bookingNumber}</p>
              <p className="text-sm text-default-600">{getCustomerName(trip)}</p>
            </div>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tripStatusClasses[trip.status] ?? "bg-default-100 text-default-600"}`}
            >
              {tripStatusLabels[trip.status] ?? trip.status}
            </span>
          </div>
          <div className="text-sm text-default-600">
            <p>
              {trip.route.pickupDate} {trip.route.pickupTime}
            </p>
            <p className="truncate">{trip.route.pickupAddress}</p>
            <p className="truncate">→ {trip.route.dropoffAddress}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TripCard;
