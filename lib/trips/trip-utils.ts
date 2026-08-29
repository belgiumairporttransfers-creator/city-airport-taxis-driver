import type { TripSummary } from "@/lib/schemas/trip";

export const tripStatusLabels: Record<string, string> = {
  driver_accepted: "Accepted",
  driver_arrived: "Arrived",
  passenger_onboard: "Passenger Onboard",
  trip_started: "In Progress",
  completed: "Completed",
};

export const tripStatusClasses: Record<string, string> = {
  driver_accepted: "bg-info/10 text-info",
  driver_arrived: "bg-warning/10 text-warning",
  passenger_onboard: "bg-warning/10 text-warning",
  trip_started: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
};

export const formatTripDateTime = (value?: string) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";

export type TripAction = "arrived" | "passenger-onboard" | "start" | "complete";

export const getNextTripAction = (status: string): TripAction | null => {
  switch (status) {
    case "driver_accepted":
      return "arrived";
    case "driver_arrived":
      return "passenger-onboard";
    case "passenger_onboard":
      return "start";
    case "trip_started":
      return "complete";
    default:
      return null;
  }
};

export const tripActionLabels: Record<TripAction, string> = {
  arrived: "Mark Arrived",
  "passenger-onboard": "Passenger Onboard",
  start: "Start Trip",
  complete: "Complete Trip",
};

/**
 * Index of the *next* step to perform.
 * Steps before this index are completed (checkmark).
 * After Accept, Accepted is already done — highlight Arrived next.
 */
export const getTripStepIndex = (status: string) => {
  switch (status) {
    case "driver_accepted":
      return 1;
    case "driver_arrived":
      return 2;
    case "passenger_onboard":
      return 3;
    case "trip_started":
      return 4;
    case "completed":
      return 4;
    default:
      return 1;
  }
};

export const tripSteps = [
  "Accepted",
  "Arrived",
  "Onboard",
  "Started",
  "Completed",
];

export const IN_PROGRESS_TRIP_STATUSES = [
  "driver_accepted",
  "driver_arrived",
  "passenger_onboard",
  "trip_started",
] as const;

export const sortTripsByPickup = <T extends { route: { pickupDate: string; pickupTime: string } }>(
  trips: T[]
) =>
  [...trips].sort((left, right) => {
    const leftKey = `${left.route.pickupDate}T${left.route.pickupTime}`;
    const rightKey = `${right.route.pickupDate}T${right.route.pickupTime}`;
    return leftKey.localeCompare(rightKey);
  });

export const getCustomerName = (trip: Pick<TripSummary, "customer">) =>
  `${trip.customer.firstName} ${trip.customer.lastName}`;
