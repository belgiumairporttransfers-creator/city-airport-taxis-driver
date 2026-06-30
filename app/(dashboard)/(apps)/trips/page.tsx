import { getSeoMeta } from "@/lib/get-seo-meta";
import TripsPageView from "./page-view";

export const metadata = getSeoMeta({
  title: "Active Trips",
  description: "View and manage your in-progress trips and update trip status.",
});

const TripsPage = () => {
  return <TripsPageView />;
};

export default TripsPage;
