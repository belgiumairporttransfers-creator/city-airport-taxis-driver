import { getSeoMeta } from "@/lib/get-seo-meta";
import DriverBookingDetailPageView from "./page-view";

export const metadata = getSeoMeta({
  title: "Booking Details",
  description: "Review booking details and accept the trip.",
});

const DriverBookingDetailPage = () => {
  return <DriverBookingDetailPageView />;
};

export default DriverBookingDetailPage;
