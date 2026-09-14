const TRIP_TYPE_LABELS: Record<string, string> = {
  "one-way": "One way",
  one_way: "One way",
  oneway: "One way",
  hourly: "Hourly",
  "by_the_hour": "Hourly",
  "by-the-hour": "Hourly",
  "return-trip": "Return",
  return_trip: "Return",
  return: "Return",
};

export const getTripTypeLabel = (category?: string | null) => {
  const key = category?.trim().toLowerCase() ?? "";
  return TRIP_TYPE_LABELS[key] ?? (category?.trim() || "One way");
};
