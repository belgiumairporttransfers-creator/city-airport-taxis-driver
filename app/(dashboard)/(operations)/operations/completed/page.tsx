import { getSeoMeta } from "@/lib/get-seo-meta";
import DriverCompletedBookingsPageView from "./page-view";

export const metadata = getSeoMeta({
  title: "Completed Bookings",
  description: "View bookings you have completed.",
});

const DriverCompletedBookingsPage = () => {
  return <DriverCompletedBookingsPageView />;
};

export default DriverCompletedBookingsPage;
