import { getSeoMeta } from "@/lib/get-seo-meta";
import TripDetailPageView from "./page-view";

export const metadata = getSeoMeta({
  title: "Trip Details",
  description: "View trip details and update trip execution status.",
});

const TripDetailPage = () => {
  return <TripDetailPageView />;
};

export default TripDetailPage;
