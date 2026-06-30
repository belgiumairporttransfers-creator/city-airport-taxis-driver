import type { CalendarCategory } from "@/lib/interface";

export const driverBookingStatusCategories: CalendarCategory[] = [
  {
    label: "Accepted",
    value: "accepted",
    className: "data-[state=checked]:bg-info",
  },
  {
    label: "Complete",
    value: "complete",
    className: "data-[state=checked]:bg-success",
  },
];
